import { Grid, Typography } from '@mui/material';
import MaterialIcon from './MaterialIcon';
import FormInput from '@/components/common/FormInput';
import { useFormContext, Path, useWatch } from 'react-hook-form';
import { t3_imageCollection } from '@/utils/resourceImage';
import { StyledPaper, MaterialSection } from './StyledComponents';
import { TResourcePriceData, TSimulationFormData } from '../model/schema';
import useSimulationConsts from '../util/useSimulationConsts';
import useSimulationItemPriceMappingStore from '@/store/simulation/useSimulationItemPriceMappingStore';

const TIER_KEY = 't3_1';

const T3ResourcePrice = () => {
  const { control } = useFormContext<TSimulationFormData>();
  const { control: resourcePriceControl, setValue } = useFormContext<TResourcePriceData>();
  const { refineNumber, armorType } = useWatch({ control, name: 'targetRefine' });
  const { t3ResourceConsumtionSections: sections, getObjectToGetValuesFrom } =
    useSimulationConsts();
  const { itemPriceMapping } = useSimulationItemPriceMappingStore();

  return (
    <Grid container spacing={3}>
      {sections.map((section, index) => (
        <Grid item xs={12} md={4} key={index}>
          <StyledPaper>
            <Typography sx={{ mb: 2, color: 'primary.main' }}>{section.title}</Typography>
            <Grid container spacing={2}>
              {section.items.map((item) => {
                const itemId = getObjectToGetValuesFrom(
                  armorType,
                  refineNumber,
                  item.mappingValue,
                  TIER_KEY
                )?.['id'];

                const defaultValue = itemPriceMapping?.[itemId ?? ''] ?? 0;

                if (!itemId || !defaultValue) return <></>;

                // setValue(item.key, defaultValue);
                setValue(`${item.key}_price`, defaultValue);

                return (
                  <Grid item xs={12} key={item.key}>
                    <MaterialSection>
                      <MaterialIcon
                        src={t3_imageCollection[item.image]}
                        name={item.name}
                        size={32}
                      />
                      <FormInput<TResourcePriceData, Path<TResourcePriceData>>
                        name={`${item.key}_price`}
                        control={resourcePriceControl}
                        // placeholder={item.name}
                        numberFormat
                        fullWidth
                        label={item.name}
                        id={`${item.key}_price`}
                        disabled
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

export default T3ResourcePrice;
