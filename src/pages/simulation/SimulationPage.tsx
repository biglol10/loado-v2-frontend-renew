import { Box, Button, Divider, Grid } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { EArmor, ETier } from './const/simulationConsts';
import T3ExistingResources from './components/T3ExistingResources';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SectionTitle } from './components/SectionTitle';
import { simulationFormSchema, TSimulationFormData } from './model/schema';
import ProbabilityInfo from './components/ProbabilityInfo';
import TargetRefineInfo from './components/TargetRefineInfo';
import T4ExistingResources from './components/T4ExistingResources';
import T3ResourceCost from './components/T3ResourceCost';
import T4ResourceCost from './components/T4ResourceCost';

const SimulationPage = () => {
  const { t } = useTranslation();

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
              <SectionTitle>{t('simulation.sections.refineCost')}</SectionTitle>
              {watchedTier === ETier.T3 && <T3ResourceCost />}
              {watchedTier === ETier.T4 && <T4ResourceCost />}
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

      <Button onClick={aa}>aa</Button>
    </Box>
  );
};

export default SimulationPage;
