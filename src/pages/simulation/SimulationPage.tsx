import { Box, Button, Divider, Typography, alpha } from '@mui/material';
import { StyledTabs, StyledTab } from '@/components/common/CustomTab';
import React, { useState } from 'react';
import WeaponImage from '@/assets/images/simulation/weapon.png';
import ArmorImage from '@/assets/images/simulation/armor.png';
import { useTranslation } from 'react-i18next';
import { EArmor, ETier } from './const/simulationConsts';
import T3ExistingResources from './components/T3ExistingResources';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SectionTitle } from './components/SectionTitle';
import { simulationFormSchema, TSimulationFormData } from './model/schema';
import ProbabilityInfo from './components/ProbabilityInfo';
import TargetRefineInfo from './components/TargetRefineInfo';

const SimulationPage = () => {
  const { t } = useTranslation();
  const [tier, setTier] = useState<ETier>(ETier.T3);
  const [armorOrWeapon, setArmorOrWeapon] = useState<EArmor>(EArmor.WEAPON);

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

  const handleTierformChange = (_: React.SyntheticEvent, newValue: ETier) => {
    if (newValue !== null) {
      setTier(newValue);
    }
  };

  const handleArmorformChange = (_: React.SyntheticEvent, newValue: EArmor) => {
    if (newValue !== null) {
      setArmorOrWeapon(newValue);
    }
  };

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
    <Box sx={{ p: 3 }}>
      {/* 재료 섹션 */}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <SectionTitle>{t('simulation.sections.targetRefine')}</SectionTitle>
          <TargetRefineInfo />
          <Divider sx={{ margin: '25px 0px' }} />
          <SectionTitle>{t('simulation.sections.materials')}</SectionTitle>
          {tier === ETier.T3 && <T3ExistingResources armor={armorOrWeapon} />}
          <Divider sx={{ margin: '25px 0px' }} />
          <SectionTitle>{t('simulation.sections.targetRefine')}</SectionTitle>
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
