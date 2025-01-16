import { Box, Button, Divider } from '@mui/material';
import React, { useState } from 'react';
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
          <SectionTitle>{t('simulation.sections.materials')}</SectionTitle>
          {watchedTier === ETier.T3 && <T3ExistingResources />}
          {watchedTier === ETier.T4 && <T4ExistingResources />}
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
