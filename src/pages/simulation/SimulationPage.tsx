import { Box, Button, Divider, Grid, Paper, Typography, alpha, styled } from '@mui/material';
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

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(8px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
}));

const SimulationPage = () => {
  const { t } = useTranslation();
  const [tier, setTier] = useState<ETier>(ETier.T4);
  const [armorOrWeapon, setArmorOrWeapon] = useState<EArmor>(EArmor.WEAPON);

  const methods = useForm<TSimulationFormData>({
    resolver: zodResolver(simulationFormSchema),
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
  };

  const aa = () => {
    const a = getValues();

    console.log('a', a);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', gap: 7 }}>
        <Box sx={{ mb: 3 }}>
          <StyledTabs
            value={tier}
            onChange={handleTierformChange}
            sx={{
              minHeight: 40,
              width: 'fit-content',
              backgroundColor: alpha('#000', 0.2),
              padding: 0.5,
              borderRadius: 1,
            }}
          >
            <StyledTab
              value={ETier.T4}
              label={t('simulation.tier.T4')}
              sx={{ minHeight: 32, fontSize: '0.875rem', px: 3 }}
            />
            <StyledTab
              value={ETier.T3}
              label={t('simulation.tier.T3')}
              sx={{ minHeight: 32, fontSize: '0.875rem', px: 3 }}
            />
          </StyledTabs>
        </Box>
        <Box sx={{ mb: 3 }}>
          <StyledTabs
            value={armorOrWeapon}
            onChange={handleArmorformChange}
            sx={{
              minHeight: 40,
              width: 'fit-content',
              backgroundColor: alpha('#000', 0.2),
              padding: 0.5,
              borderRadius: 1,
            }}
          >
            <StyledTab
              value={EArmor.WEAPON}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    component="img"
                    src={WeaponImage}
                    alt="weapon"
                    sx={{ width: 20, height: 20, borderRadius: 5 }}
                  />{' '}
                  <Typography variant="body2">{t('simulation.armor.weapon')}</Typography>
                </Box>
              }
              sx={{ minHeight: 32, fontSize: '0.875rem', px: 3 }}
            />
            <StyledTab
              value={EArmor.ARMOR}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    component="img"
                    src={ArmorImage}
                    alt="armor"
                    sx={{ width: 20, height: 20, borderRadius: 5 }}
                  />{' '}
                  <Typography variant="body2">{t('simulation.armor.armor')}</Typography>
                </Box>
              }
              sx={{ minHeight: 32, fontSize: '0.875rem', px: 3 }}
            />
          </StyledTabs>
        </Box>
      </Box>

      {/* 재료 섹션 */}
      <FormProvider {...methods}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <SectionTitle>{t('simulation.sections.materials')}</SectionTitle>
          {tier === ETier.T3 && <T3ExistingResources armor={armorOrWeapon} />}
          <Divider sx={{ margin: '25px 0px' }} />
          <SectionTitle>{t('simulation.sections.probability')}</SectionTitle>
          <ProbabilityInfo />

          <Button type="submit" variant="outlined">
            {t('simulation.buttons.startSimulation')}
          </Button>
        </Box>
      </FormProvider>

      <Button onClick={aa}>aa</Button>
    </Box>
  );
};

export default SimulationPage;
