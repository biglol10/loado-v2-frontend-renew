import { Box, Typography } from '@mui/material';
import { HeaderContainer } from './StyledComponents';
import FormSelect from '@/components/common/FormSelect';
import { Controller, useFormContext } from 'react-hook-form';
import { TSimulationFormData, TTargetRefineInfoData } from '../model/schema';
import { StyledToolbar } from '@/pages/home/styles/styles';
import { StyledTab, StyledTabs } from '@/components/common/CustomTab';
import { useTranslation } from 'react-i18next';
import Weapon from '@/assets/images/simulation/weapon.png';
import Armor from '@/assets/images/simulation/armor.png';
import { EArmor, ETier } from '../const/simulationConsts';

const TargetRefineInfo = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<TTargetRefineInfoData>();
  const { t } = useTranslation();

  return (
    <HeaderContainer>
      <Box component="form" sx={{ display: 'flex', alignItems: 'center' }}>
        <StyledToolbar variant="dense" disableGutters>
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: 0,
              gap: 10,
            }}
          >
            <Box>
              <Controller
                name="tier"
                control={control}
                defaultValue={ETier.T4}
                render={({ field: { onChange, value = ETier.T4 } }) => (
                  <StyledTabs
                    value={value}
                    onChange={(_, tabValue: ETier) => {
                      onChange(tabValue);
                    }}
                  >
                    <StyledTab value={ETier.T3} label={t('item-price.label.tab3')} />
                    <StyledTab value={ETier.T4} label={t('item-price.label.tab2')} />
                  </StyledTabs>
                )}
              />
            </Box>

            <FormSelect<string>
              id="armor-type-select"
              name="armorType"
              control={control}
              label={t('simulation.sections.armorType')}
              defaultValue={EArmor.WEAPON}
              options={[
                {
                  label: (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        component="img"
                        src={Weapon}
                        alt="weapon"
                        sx={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover' }}
                      />
                      {t('simulation.armor.weapon')}
                    </Box>
                  ),
                  value: EArmor.WEAPON,
                },
                {
                  label: (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        component="img"
                        src={Armor}
                        alt="armor"
                        sx={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover' }}
                      />
                      {t('simulation.armor.armor')}
                    </Box>
                  ),
                  value: EArmor.ARMOR,
                },
              ]}
            />

            <FormSelect<number>
              id="refine-number-select"
              name="refineNumber"
              control={control}
              label={t('simulation.sections.targetRefine')}
              defaultValue={13}
              options={Array.from({ length: 13 }, (_, index) => ({
                label: `${13 + index} 단계`,
                value: 13 + index,
              }))}
            />
          </Box>
        </StyledToolbar>
      </Box>
    </HeaderContainer>
  );
};

export default TargetRefineInfo;
