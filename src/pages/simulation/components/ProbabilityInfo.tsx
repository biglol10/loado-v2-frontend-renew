import { Grid, Typography } from '@mui/material';
import { StyledPaper, MaterialSection } from './StyledComponents';
import { useFormContext } from 'react-hook-form';
import { TSimulationFormData } from '../model/schema';
import FormInput from '@/components/common/FormInput';
import { useTranslation } from 'react-i18next';

const ProbabilityInfo = () => {
  const { t } = useTranslation();
  const { control } = useFormContext<TSimulationFormData>();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <StyledPaper>
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            {t('simulation.probability.title')}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <MaterialSection>
                <Typography>{t('simulation.probability.baseRate')}</Typography>
                <FormInput
                  name="probability.baseSuccessRate"
                  control={control}
                  placeholder={t('simulation.probability.baseRate')}
                  percentageFormat
                />
              </MaterialSection>
            </Grid>
            <Grid item xs={12}>
              <MaterialSection>
                <Typography>{t('simulation.probability.artisanEnergy')}</Typography>
                <FormInput
                  name="probability.artisanEnergy"
                  control={control}
                  placeholder={t('simulation.probability.artisanEnergy')}
                  percentageFormat
                />
              </MaterialSection>
            </Grid>
          </Grid>
        </StyledPaper>
      </Grid>
    </Grid>
  );
};

export default ProbabilityInfo;
