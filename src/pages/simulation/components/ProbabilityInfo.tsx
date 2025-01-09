import { Box, Checkbox, Grid, Typography } from '@mui/material';
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
          <Typography sx={{ width: '90px' }}>{t('simulation.probability.baseRate')}</Typography>
          <FormInput
            name="probability.baseSuccessRate"
            control={control}
            placeholder={t('simulation.probability.baseRate')}
            percentageFormat
            fullWidth={false}
          />
        </MaterialSection>
        {/* 추가 성공확률 (이벤트, 슈모익, 등) */}
        <MaterialSection>
          <Typography sx={{ width: '90px' }}>
            {t('simulation.probability.additionalSuccessRate')}
          </Typography>
          <FormInput
            name="probability.additionalSuccessRate"
            control={control}
            placeholder={t('simulation.probability.additionalSuccessRate')}
            percentageFormat
            fullWidth={false}
          />
        </MaterialSection>
        {/* 장인의 기운 */}
        <MaterialSection>
          <Typography sx={{ width: '90px' }}>
            {t('simulation.probability.artisanEnergy')}
          </Typography>
          <FormInput
            name="probability.artisanEnergy"
            control={control}
            placeholder={t('simulation.probability.artisanEnergy')}
            percentageFormat
            fullWidth={false}
          />
        </MaterialSection>
        <MaterialSection>
          <Box sx={{ width: '90px', display: 'flex', alignItems: 'center' }}>
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
