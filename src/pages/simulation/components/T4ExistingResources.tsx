import { Grid, Typography } from '@mui/material';
import { EArmor } from '../const/simulationConsts';
import MaterialIcon from './MaterialIcon';
import FormInput from '@/components/common/FormInput';
import { useFormContext, Path, useWatch } from 'react-hook-form';
import { t4_imageCollection } from '@/utils/resourceImage';
import { StyledPaper, MaterialSection } from './StyledComponents';
import { existingResourceSchema, TSimulationFormData } from '../model/schema';
import { useTranslation } from 'react-i18next';
import useSimulationConsts from '../util/useSimulationConsts';

const T4ExistingResources = () => {
  const { t } = useTranslation();
  const { control } = useFormContext<TSimulationFormData>();
  const targetRefine = useWatch({ control, name: 'targetRefine' });
  const { armorType = EArmor.WEAPON, refineNumber = 13 } = targetRefine ?? {};
  const { t4ResourceConsumtionSections: sections } = useSimulationConsts(armorType);

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
                    <MaterialIcon src={t4_imageCollection[item.image]} name={item.name} size={32} />
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

export default T4ExistingResources;
