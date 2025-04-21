import { Box, Divider, Grid } from '@mui/material';
import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { EArmor, ETier } from './const/simulationConsts';
import T3ExistingResources from './components/T3ExistingResources';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SectionTitle, StyledTitle, TitleWrapper } from './components/SectionTitle';
import { simulationFormSchema, TSimulationFormData } from './model/schema';
import ProbabilityInfo from './components/ProbabilityInfo';
import TargetRefineInfo from './components/TargetRefineInfo';
import T4ExistingResources from './components/T4ExistingResources';
import T3ResourceConsumption from './components/T3ResourceConsumption';
import T4ResourceConsumption from './components/T4ResourceConsumption';
import { ISimulationResult, refineSimulation } from './util/simulationFunction';
import { useItemPriceQuery } from '@/apis/itemPrice/useItemPriceQuery';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import useSimulationItemPriceMappingStore, {
  IItemPriceMapping,
} from '@/store/simulation/useSimulationItemPriceMappingStore';
import T3ResourcePrice from './components/T3ResourcePrice';
import T4ResourcePrice from './components/T4ResourcePrice';
import { showErrorToast, showSuccessToast } from '@/utils/toastUtils';
import Button from '@/components/common/Button';
import { SimulationResultGraphData } from './types/types';
import {
  calculateHistogramBins,
  createHistogramData,
  findTopNPercentPoint,
} from './util/histogramUtils';
import SimulationResultBarChart from './components/SimulationResultBarChart';
import { useRenderMetrics } from '@/utils/performance/hooks/useRenderMetrics';
import { useInteractionMetrics } from '@/utils/performance/hooks/useInteractionMetrics';
import { trackMetric } from '@/utils/performance/reporter';

const SimulationPage = () => {
  // 성능 모니터링 추가
  const renderMetrics = useRenderMetrics('SimulationPage');
  const { trackInteractionStart, trackInteractionEnd } = useInteractionMetrics('runSimulation');

  const { t } = useTranslation();
  const [topNPercentPoint, setTopNPercentPoint] = useState(30);
  const [simulationResult, setSimulationResult] = useState<ISimulationResult[]>([]);
  const [activeTabCategory, setActiveTabCategory] = useState<'COST' | 'PRICE'>('COST');

  const { setItemPriceMapping } = useSimulationItemPriceMappingStore();

  const methods = useForm<TSimulationFormData>({
    resolver: zodResolver(simulationFormSchema),
    defaultValues: {
      targetRefine: {
        armorType: EArmor.WEAPON,
        refineNumber: 13,
        tier: ETier.T4,
      },
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = methods;

  // 페이지 로딩 시간 측정
  useEffect(() => {
    const pageLoadTime = performance.now();
    trackMetric('simulationPageLoad', pageLoadTime);

    // 페이지 첫 상호작용까지 시간 측정
    let firstInteraction = false;

    const trackFirstInteraction = () => {
      if (!firstInteraction) {
        firstInteraction = true;
        const timeToInteraction = performance.now() - pageLoadTime;
        trackMetric('timeToFirstInteraction', timeToInteraction);

        // 이벤트 리스너 제거
        ['click', 'keydown', 'scroll', 'touchstart'].forEach((event) => {
          window.removeEventListener(event, trackFirstInteraction);
        });
      }
    };

    // 첫 상호작용 감지
    ['click', 'keydown', 'scroll', 'touchstart'].forEach((event) => {
      window.addEventListener(event, trackFirstInteraction);
    });

    return () => {
      // 클린업
      ['click', 'keydown', 'scroll', 'touchstart'].forEach((event) => {
        window.removeEventListener(event, trackFirstInteraction);
      });
    };
  }, []);

  const { data: queryResults, isFetched } = useItemPriceQuery({
    searchDate: dayjs().format('YYYY-MM-DD'),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (isFetched) {
      const itemPRiceMappingObjectToSave: IItemPriceMapping = {};

      queryResults.forEach((query) => {
        const data = query?.data;

        if (!isEmpty(data)) {
          const dataToUse = data!;
          dataToUse.forEach((item) => {
            itemPRiceMappingObjectToSave[item.itemId] = item.minCurrentMinPrice;
          });
        }
      });

      setItemPriceMapping(itemPRiceMappingObjectToSave);
    }
  }, [isFetched, queryResults, setItemPriceMapping]);

  const watchedTier = useWatch({ control, name: 'targetRefine.tier' });

  // tier가 변경될 때마다 refineNumber 업데이트
  useEffect(() => {
    const newRefineNumber = watchedTier === ETier.T4 ? 11 : 13;
    methods.setValue('targetRefine.refineNumber', newRefineNumber);
  }, [methods, watchedTier]);

  const onSubmit = async (data: TSimulationFormData) => {
    // 시뮬레이션 수행 시간 측정 시작
    trackInteractionStart();
    const simulationStartTime = performance.now();

    const existingResources = data.existingResources;
    const probability = data.probability;
    const targetRefine = data.targetRefine;
    console.log('data is ', data);

    const successProbability =
      (probability.baseSuccessRate ?? 0) + (probability.additionalSuccessRate ?? 0);

    const artisanEnergy = probability.artisanEnergy ?? 0;

    const resultArr: ISimulationResult[] = [];

    try {
      for (let index = 0; index < 100; index++) {
        const simulationResult = refineSimulation(data, 1, successProbability, artisanEnergy);
        resultArr.push(simulationResult);
      }

      setSimulationResult(resultArr);

      // 성공적인 시뮬레이션 수행 로깅
      const simulationEndTime = performance.now();
      const duration = simulationEndTime - simulationStartTime;

      // 시뮬레이션 성능 데이터 기록
      trackMetric('simulationExecution', duration, {
        tier: targetRefine.tier,
        resultCount: resultArr.length,
        successProbability,
      });

      showSuccessToast('시뮬레이션이 완료되었습니다.');
    } catch (error) {
      if (error instanceof Error) {
        showErrorToast(error.message);

        // 에러 케이스에 대한 메트릭 기록
        trackMetric('simulationError', performance.now() - simulationStartTime, {
          errorMessage: error.message,
          tier: targetRefine.tier,
        });
      }
    } finally {
      trackInteractionEnd();
    }

    console.log('resultArr is ', resultArr);
  };

  const topNPercentPointData = useMemo<SimulationResultGraphData | null>(() => {
    if (isEmpty(simulationResult)) return null;

    // 계산 시작 시간 기록
    const calculationStartTime = performance.now();

    // 시도 횟수 추출 및 정렬
    const tryCountList = simulationResult
      .map((item: ISimulationResult) => item.tryCount)
      .sort((a: number, b: number) => a - b);

    // 히스토그램 데이터 생성
    const binSettings = calculateHistogramBins(tryCountList);
    const simulationResultGroupPointResultList = createHistogramData(tryCountList, binSettings);
    const topNPercentPointRange = findTopNPercentPoint(
      tryCountList,
      simulationResultGroupPointResultList,
      topNPercentPoint
    );

    // 계산 시간 측정 및 기록
    const calculationTime = performance.now() - calculationStartTime;
    trackMetric('histogramCalculationTime', calculationTime, {
      dataPointCount: tryCountList.length,
      binCount: simulationResultGroupPointResultList.length,
    });

    return {
      simulationResultGroupPointResultList,
      topNPercentPointRange,
    };
  }, [simulationResult, topNPercentPoint]);

  console.log('topNPercentPointData is ', topNPercentPointData);

  const onError = (errors: any) => {
    console.log('errors is ', errors);
    showErrorToast('입력 값이 올바르지 않습니다.');

    // 폼 에러 추적
    trackMetric('formValidationError', Object.keys(errors).length, {
      errorFields: Object.keys(errors),
    });
  };

  return (
    <Box sx={{ p: 3, width: '100%', bgcolor: 'background.paper', marginTop: '20px' }}>
      {/* 재료 섹션 */}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <SectionTitle>{t('simulation.sections.targetRefine')}</SectionTitle>
          <TargetRefineInfo />
          <Divider sx={{ margin: '25px 0px' }} />
          <Grid container columnSpacing={{ xs: 1, sm: 2, md: 10 }} xs={12}>
            <Grid item xs={7}>
              <SectionTitle>{t('simulation.sections.materials')}</SectionTitle>
              {watchedTier === ETier.T3 && <T3ExistingResources />}
              {watchedTier === ETier.T4 && <T4ExistingResources />}
            </Grid>
            <Grid item xs={5}>
              <TitleWrapper>
                <StyledTitle
                  active={activeTabCategory === 'COST'}
                  onClick={() => setActiveTabCategory('COST')}
                  sx={{ cursor: 'pointer' }}
                >
                  {t('simulation.sections.resourceConsumption')}
                </StyledTitle>
                {' / '}
                <StyledTitle
                  active={activeTabCategory === 'PRICE'}
                  onClick={() => setActiveTabCategory('PRICE')}
                  sx={{ cursor: 'pointer' }}
                >
                  {t('simulation.sections.resourceCost')}
                </StyledTitle>
              </TitleWrapper>
              {watchedTier === ETier.T3 && (
                <>
                  <T3ResourceConsumption activeCategory={activeTabCategory} />
                  <T3ResourcePrice activeCategory={activeTabCategory} />
                </>
              )}
              {watchedTier === ETier.T4 && (
                <>
                  <T4ResourceConsumption activeCategory={activeTabCategory} />
                  <T4ResourcePrice activeCategory={activeTabCategory} />
                </>
              )}
            </Grid>
          </Grid>

          <Divider sx={{ margin: '25px 0px' }} />
          <SectionTitle>{t('simulation.sections.probability')}</SectionTitle>
          <ProbabilityInfo />

          <br />

          <Button type="submit" variant="outlined" loading={isSubmitting}>
            {t('simulation.buttons.startSimulation')}
          </Button>
        </form>

        <Divider sx={{ margin: '50px 0px' }} />

        {!isSubmitting && topNPercentPointData && (
          <SimulationResultBarChart
            topNPercentPointData={topNPercentPointData}
            topNPercentPoint={topNPercentPoint}
          />
        )}
      </FormProvider>
    </Box>
  );
};

export default SimulationPage;
