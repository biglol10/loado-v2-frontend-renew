import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  Typography,
} from '@mui/material';
import { StyledPaper, MaterialSection } from './StyledComponents';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { TSimulationFormData } from '../model/schema';
import FormInput from '@/components/common/FormInput';
import { useTranslation } from 'react-i18next';
import { pink } from '@mui/material/colors';
import { t3_imageCollection, t4_imageCollection } from '@/utils/resourceImage';
import { EArmor, ETier } from '../const/simulationConsts';
import { useEffect } from 'react';
import { requiredRefineMaterialsData } from '../const/requiredRefineMaterialsData';

const ProbabilityInfo = () => {
  const { t } = useTranslation();
  const { control, setValue } = useFormContext<TSimulationFormData>();
  const targetRefineObject = useWatch({ control, name: 'targetRefine' });

  const { armorType = EArmor.WEAPON, tier = ETier.T4, refineNumber = 11 } = targetRefineObject;

  useEffect(() => {
    const baseObject =
      requiredRefineMaterialsData[armorType.toLocaleLowerCase()][
        tier === ETier.T4 ? 't4_1' : 't3_1'
      ]?.[refineNumber];

    const baseSuccessRate = baseObject?.['기본확률'] ?? 0;
    setValue('probability.baseSuccessRate', baseSuccessRate * 100);

    const bookSuccessRate = baseObject?.['book']?.probability ?? 0;
    setValue('probability.bookProbability', bookSuccessRate * 100);
  }, [armorType, tier, refineNumber, setValue]);

  const bookImage = (() => {
    if (tier === ETier.T4) {
      if (armorType === EArmor.WEAPON) {
        return t4_imageCollection['야금술업화'];
      } else {
        return t4_imageCollection['재봉술업화'];
      }
    } else {
      if (armorType === EArmor.WEAPON) {
        return t3_imageCollection['야금술복합'];
      } else {
        return t3_imageCollection['재봉술복합'];
      }
    }
  })();

  const breathImage = (() => {
    if (tier === ETier.T4) {
      if (armorType === EArmor.WEAPON) {
        return t4_imageCollection['용암의숨결'];
      } else {
        return t4_imageCollection['빙하의숨결'];
      }
    } else {
      return t3_imageCollection['가호'];
    }
  })();

  const isBookAvailable =
    !!requiredRefineMaterialsData[armorType.toLocaleLowerCase()][
      tier === ETier.T4 ? 't4_1' : 't3_1'
    ]?.[refineNumber]?.['book'];

  return (
    <StyledPaper>
      <Box sx={{ display: 'flex', gap: 5 }}>
        {/* 기본 성공확률 */}
        <MaterialSection>
          {/* <FormControl sx={{ width: '120px' }}>
            <InputLabel shrink htmlFor="base-success-rate">
              {t('simulation.probability.baseRate')}
            </InputLabel>
          </FormControl> */}
          <FormInput
            id="base-success-rate"
            name="probability.baseSuccessRate"
            label={t('simulation.probability.baseRate')}
            control={control}
            placeholder={t('simulation.probability.baseRate')}
            percentageFormat
            fullWidth={false}
          />
        </MaterialSection>
        {/* 추가 성공확률 (이벤트, 슈모익, 등) */}
        <MaterialSection>
          {/* <FormControl sx={{ width: '120px' }}>
            <InputLabel shrink htmlFor="additional-success-rate">
              {t('simulation.probability.additionalSuccessRate')}
            </InputLabel>
          </FormControl> */}
          <FormInput
            id="additional-success-rate"
            name="probability.additionalSuccessRate"
            label={t('simulation.probability.additionalSuccessRate')}
            control={control}
            placeholder={t('simulation.probability.additionalSuccessRate')}
            percentageFormat
            fullWidth={false}
          />
        </MaterialSection>
        {/* 장인의 기운 */}
        <MaterialSection>
          {/* <FormControl sx={{ width: '120px' }}>
            <InputLabel shrink htmlFor="artisan-energy">
              {t('simulation.probability.artisanEnergy')}
            </InputLabel>
          </FormControl> */}
          <FormInput
            id="artisan-energy"
            name="probability.artisanEnergy"
            control={control}
            label={t('simulation.probability.artisanEnergy')}
            placeholder={t('simulation.probability.artisanEnergy')}
            percentageFormat
            fullWidth={false}
          />
        </MaterialSection>

        {/* 보조재료 */}
        <MaterialSection>
          <MaterialSection sx={{ minWidth: '60px', display: 'flex', alignItems: 'center' }}>
            {/* <Box>
              <InputLabel shrink htmlFor="book-probability">
                {t('simulation.probability.bookRate', {
                  book:
                    armorType === EArmor.WEAPON
                      ? t('simulation.materials.야금술')
                      : t('simulation.materials.재봉술'),
                })}
              </InputLabel>
            </Box> */}

            <Controller
              name="probability.isUseBook"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Checkbox
                  sx={{
                    color: pink[800],
                    '&.Mui-checked': {
                      color: pink[600],
                    },
                  }}
                  disabled={!isBookAvailable}
                  value={value}
                  onChange={(_, checked) => onChange(checked)}
                />
              )}
            />
            <Box
              component="img"
              src={bookImage}
              sx={{ height: 25, width: 25, borderRadius: '10%' }}
            />
          </MaterialSection>
          <FormInput
            id="book-probability"
            name="probability.bookProbability"
            label={t('simulation.probability.bookRate', {
              book:
                armorType === EArmor.WEAPON
                  ? t('simulation.materials.야금술')
                  : t('simulation.materials.재봉술'),
            })}
            control={control}
            placeholder={armorType === EArmor.WEAPON ? '야금술책확률' : '재봉술책확률'}
            percentageFormat
            fullWidth={false}
            disabled={!isBookAvailable}
          />
        </MaterialSection>
        <MaterialSection>
          <Controller
            name="probability.isFullSoom"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{ color: pink[800], '&.Mui-checked': { color: pink[600] } }}
                    onChange={(_, checked) => onChange(checked)}
                    value={value}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      component="img"
                      src={breathImage}
                      sx={{ height: 25, width: 25, borderRadius: '10%' }}
                    />
                    <Typography>{t('simulation.probability.fullSoom')}</Typography>
                  </Box>
                }
              />
            )}
          />
        </MaterialSection>
      </Box>
    </StyledPaper>
  );
};

export default ProbabilityInfo;
