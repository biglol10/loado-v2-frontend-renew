import { Grid, Typography } from '@mui/material';
import MaterialIcon from './MaterialIcon';
import FormInput from '@/components/common/FormInput';
import { useFormContext, Path, useWatch } from 'react-hook-form';
import { t4_imageCollection } from '@/utils/resourceImage';
import { StyledPaper, MaterialSection } from './StyledComponents';
import { TResourcePriceData, TSimulationFormData } from '../model/schema';
import useSimulationConsts from '../util/useSimulationConsts';
import useSimulationItemPriceMappingStore from '@/store/simulation/useSimulationItemPriceMappingStore';

const TIER_KEY = 't4_1';

const T4ResourcePrice = ({ activeCategory }: { activeCategory: 'COST' | 'PRICE' }) => {
  const { control, setValue } = useFormContext<TSimulationFormData>();
  // const { control: resourcePriceControl, setValue } = useFormContext<TResourcePriceData>();
  const { refineNumber, armorType } = useWatch({ control, name: 'targetRefine' });
  const { t4ResourceConsumtionSections: sections, getObjectToGetValuesFrom } =
    useSimulationConsts();
  const { itemPriceMapping } = useSimulationItemPriceMappingStore();

  return (
    <Grid
      container
      spacing={3}
      sx={{
        display: `${activeCategory === 'PRICE' ? 'auto' : 'none'}`,
      }}
    >
      {sections.map((section, index) => (
        <Grid item xs={12} md={4} key={`T4ResourcePrice-${index}`}>
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
                setValue(`resourcePrice.${item.key}_price`, defaultValue);

                return (
                  <Grid item xs={12} key={item.key}>
                    <MaterialSection>
                      <MaterialIcon
                        src={t4_imageCollection[item.id as keyof typeof t4_imageCollection].image}
                        name={item.name}
                        size={32}
                      />
                      <FormInput<TSimulationFormData, Path<TSimulationFormData>>
                        name={`resourcePrice.${item.key}_price`}
                        control={control}
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

export default T4ResourcePrice;
