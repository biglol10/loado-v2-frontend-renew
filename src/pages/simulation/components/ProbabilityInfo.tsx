import { Box, Checkbox, FormControl, InputLabel } from '@mui/material';
import { StyledPaper, MaterialSection } from './StyledComponents';
import { useFormContext } from 'react-hook-form';
import { TSimulationFormData } from '../model/schema';
import FormInput from '@/components/common/FormInput';
import { useTranslation } from 'react-i18next';
import { pink } from '@mui/material/colors';
import BookImage from '@/assets/images/items/armorbook.webp';

const ProbabilityInfo = () => {
  const { t } = useTranslation();
  const { control } = useFormContext<TSimulationFormData>();

  return (
    <StyledPaper>
      <Box sx={{ display: 'flex', gap: 5 }}>
        {/* 기본 성공확률 */}
        <MaterialSection>
          <FormControl sx={{ width: '120px' }}>
            <InputLabel shrink htmlFor="base-success-rate">
              {t('simulation.probability.baseRate')}
            </InputLabel>
          </FormControl>
          <FormInput
            id="base-success-rate"
            name="probability.baseSuccessRate"
            control={control}
            placeholder={t('simulation.probability.baseRate')}
            percentageFormat
            fullWidth={false}
          />
        </MaterialSection>
        {/* 추가 성공확률 (이벤트, 슈모익, 등) */}
        <MaterialSection>
          <FormControl sx={{ width: '120px' }}>
            <InputLabel shrink htmlFor="additional-success-rate">
              {t('simulation.probability.additionalSuccessRate')}
            </InputLabel>
          </FormControl>
          <FormInput
            id="additional-success-rate"
            name="probability.additionalSuccessRate"
            control={control}
            placeholder={t('simulation.probability.additionalSuccessRate')}
            percentageFormat
            fullWidth={false}
          />
        </MaterialSection>
        {/* 장인의 기운 */}
        <MaterialSection>
          <FormControl sx={{ width: '120px' }}>
            <InputLabel shrink htmlFor="artisan-energy">
              {t('simulation.probability.artisanEnergy')}
            </InputLabel>
          </FormControl>
          <FormInput
            id="artisan-energy"
            name="probability.artisanEnergy"
            control={control}
            placeholder={t('simulation.probability.artisanEnergy')}
            percentageFormat
            fullWidth={false}
          />
        </MaterialSection>

        {/* 보조재료 */}
        <MaterialSection>
          <Box sx={{ width: '120px', display: 'flex', alignItems: 'center' }}>
            <Checkbox
              sx={{
                color: pink[800],
                '&.Mui-checked': {
                  color: pink[600],
                },
              }}
            />
            <Box
              component="img"
              src={BookImage}
              sx={{ height: 25, width: 25, borderRadius: '10%' }}
            />
          </Box>
          <FormInput
            id="book-probability"
            name="probability.bookProbability"
            control={control}
            placeholder="보조책확률"
            percentageFormat
            fullWidth={false}
          />
        </MaterialSection>
      </Box>
    </StyledPaper>
  );
};

export default ProbabilityInfo;
