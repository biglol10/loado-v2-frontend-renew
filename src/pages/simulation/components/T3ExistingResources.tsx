import { Grid, Typography } from '@mui/material';
import MaterialIcon from './MaterialIcon';
import FormInput from '@/components/common/FormInput';
import { useFormContext, Path, useWatch } from 'react-hook-form';
import { t3_imageCollection } from '@/utils/resourceImage';
import { StyledPaper, MaterialSection } from './StyledComponents';
import { TSimulationFormData } from '../model/schema';
import useSimulationConsts from '../util/useSimulationConsts';

const T3ExistingResources = () => {
  const { control } = useFormContext<TSimulationFormData>();
  const watchedValue = useWatch({ control, name: 'targetRefine' });
  const { t3ResourceConsumtionSections: sections } = useSimulationConsts();

  return (
    <Grid container spacing={3}>
      {sections.map((section, index) => (
        <Grid item xs={12} md={4} key={index}>
          <StyledPaper>
            <Typography sx={{ mb: 2, color: 'primary.main' }}>{section.title}</Typography>
            <Grid container spacing={2}>
              {section.items.map((item) => (
                <Grid item xs={12} key={item.key}>
                  <MaterialSection>
                    <MaterialIcon src={t3_imageCollection[item.image]} name={item.name} size={32} />
                    <FormInput<TSimulationFormData, Path<TSimulationFormData>>
                      name={`existingResources.${item.key}`}
                      control={control}
                      // placeholder={item.name}
                      numberFormat
                      fullWidth
                      label={item.name}
                      id={item.key}
                    />
                  </MaterialSection>
                </Grid>
              ))}
            </Grid>
          </StyledPaper>
        </Grid>
      ))}
    </Grid>
  );
};

export default T3ExistingResources;
