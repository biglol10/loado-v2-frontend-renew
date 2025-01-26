import { Box, Button, Divider, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
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

const SimulationPage = () => {
  const { t } = useTranslation();
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
    formState: { errors },
    getValues,
  } = methods;

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

  const onSubmit = (data: TSimulationFormData) => {
    console.log('data', data);
    alert('ASDF');
  };

  const aa = () => {
    const a = getValues();

    console.log('a', a);
  };

  const onError = (errors: any) => {
    alert('error');
    console.log('errors is ', errors);
  };

  const startSimulation = () => {
    const formValues = getValues();

    const probability =
      (formValues.probability.baseSuccessRate ?? 0) +
      (formValues.probability.additionalSuccessRate ?? 0);

    const artisanEnergy = formValues.probability.artisanEnergy ?? 0;

    const resultArr: ISimulationResult[] = [];

    for (let index = 0; index < 100; index++) {
      const simulationResult = refineSimulation(formValues, 1, probability, artisanEnergy);
      resultArr.push(simulationResult);
    }

    console.log('resultArr is ', resultArr);
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
              {watchedTier === ETier.T3 &&
                (activeTabCategory === 'COST' ? <T3ResourceConsumption /> : <T3ResourcePrice />)}
              {watchedTier === ETier.T4 &&
                (activeTabCategory === 'COST' ? <T4ResourceConsumption /> : <T4ResourcePrice />)}
            </Grid>
          </Grid>

          <Divider sx={{ margin: '25px 0px' }} />
          <SectionTitle>{t('simulation.sections.probability')}</SectionTitle>
          <ProbabilityInfo />

          <Button type="submit" variant="outlined">
            {t('simulation.buttons.startSimulation')}
          </Button>
        </form>
      </FormProvider>

      <Button onClick={startSimulation}>시뮬레이션 시작</Button>
    </Box>
  );
};

export default SimulationPage;
