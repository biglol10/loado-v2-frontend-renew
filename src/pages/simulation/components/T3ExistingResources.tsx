import { Grid, Typography } from '@mui/material';
import MaterialIcon from './MaterialIcon';
import FormInput from '@/components/common/FormInput';
import { useFormContext, Path, useWatch } from 'react-hook-form';
import { t3_imageCollection } from '@/utils/resourceImage';
import { StyledPaper, MaterialSection } from './StyledComponents';
import { existingResourceSchema, TSimulationFormData } from '../model/schema';
import { useTranslation } from 'react-i18next';
import { requiredRefineMaterialsData } from '../const/requiredRefineMaterialsData';

const T3ExistingResources = () => {
  const { t } = useTranslation();
  const { control } = useFormContext<TSimulationFormData>();
  const watchedValue = useWatch({ control, name: 'targetRefine' });

  const sections: Array<{
    title: string;
    items: Array<{
      key: keyof typeof existingResourceSchema.shape;
      name: string;
      image: keyof typeof t3_imageCollection;
    }>;
  }> = [
    {
      title: t('simulation.materials.fragmentAndBook'),
      items: [
        { key: 't3fragment', name: t('simulation.materials.fragment'), image: '명예의파편' },
        { key: 't3book', name: t('simulation.materials.book'), image: '책' },
      ],
    },
    {
      title: t('simulation.materials.stone'),
      items: [
        { key: 't3RedStone', name: t('simulation.materials.redStone'), image: '파괴석' },
        { key: 't3BlueStone', name: t('simulation.materials.blueStone'), image: '수호석' },
        {
          key: 't3BlueCommonStone',
          name: t('simulation.materials.blueCommonStone'),
          image: '찬명돌',
        },
      ],
    },
    {
      title: t('simulation.materials.refinementStone'),
      items: [
        { key: 't3BreathStoneHigh', name: t('simulation.materials.solarGrace'), image: '가호' },
        {
          key: 't3BreathStoneMedium',
          name: t('simulation.materials.solarBlessing'),
          image: '축복',
        },
        {
          key: 't3BreathStoneLow',
          name: t('simulation.materials.solarProtection'),
          image: '은총',
        },
      ],
    },
  ];

  return (
    <Grid container spacing={3}>
      {sections.map((section, index) => (
        <Grid item xs={12} md={4} key={index}>
          <StyledPaper>
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
              {section.title}
            </Typography>
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
