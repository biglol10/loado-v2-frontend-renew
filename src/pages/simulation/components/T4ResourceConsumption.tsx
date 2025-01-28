import { Grid, Typography } from '@mui/material';
import MaterialIcon from './MaterialIcon';
import FormInput from '@/components/common/FormInput';
import { useFormContext, Path, useWatch, useForm } from 'react-hook-form';
import { t4_imageCollection } from '@/utils/resourceImage';
import { StyledPaper, MaterialSection } from './StyledComponents';
import { TResourceConsumptionData, TSimulationFormData } from '../model/schema';
import useSimulationConsts from '../util/useSimulationConsts';

const TIER_KEY = 't4_1';

const T4ResourceConsumption = () => {
  const { control } = useFormContext<TSimulationFormData>();
  const { control: resourceConsumptionControl, setValue } =
    useFormContext<TResourceConsumptionData>();
  const { refineNumber, armorType } = useWatch({ control, name: 'targetRefine' });
  const { t4ResourceConsumtionSections: sections, getObjectToGetValuesFrom } =
    useSimulationConsts(armorType);

  return (
    <Grid container spacing={3}>
      {sections.map((section, index) => (
        <Grid item xs={12} md={4} key={`T4ResourceConsumption-${index}`}>
          <StyledPaper>
            <Typography sx={{ mb: 2, color: 'primary.main' }}>{section.title}</Typography>
            <Grid container spacing={2}>
              {section.items.map((item) => {
                let defaultValue;

                if (item.key === 'refineGold') {
                  defaultValue =
                    getObjectToGetValuesFrom(
                      armorType,
                      refineNumber,
                      item.mappingValue,
                      TIER_KEY
                    ) ?? 0;
                } else {
                  defaultValue =
                    getObjectToGetValuesFrom(
                      armorType,
                      refineNumber,
                      item.mappingValue,
                      TIER_KEY
                    )?.[item.mappingValue === 'book' ? 'probability' : 'count'] ?? 0;
                }

                // setValue(item.key, defaultValue);
                setValue(item.key, defaultValue * (item.mappingValue === 'book' ? 100 : 1));

                return (
                  <Grid item xs={12} key={item.key}>
                    <MaterialSection>
                      <MaterialIcon
                        src={t4_imageCollection[item.image]}
                        name={item.name}
                        size={32}
                      />
                      <FormInput<TResourceConsumptionData, Path<TResourceConsumptionData>>
                        name={`${item.key}`}
                        control={resourceConsumptionControl}
                        numberFormat={item.mappingValue !== 'book'}
                        fullWidth
                        label={item.name}
                        id={`${item.key}_cost`}
                        percentageFormat={item.mappingValue === 'book'}
                        // disabled={disabled}
                      />
                    </MaterialSection>
                  </Grid>
                );
              })}
            </Grid>
          </StyledPaper>
        </Grid>
      ))}
    </Grid>
  );
};

export default T4ResourceConsumption;
