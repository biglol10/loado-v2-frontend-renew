import { Grid, Typography } from '@mui/material';
import { EArmor } from '../const/simulationConsts';
import MaterialIcon from './MaterialIcon';
import FormInput from '@/components/common/FormInput';
import { useFormContext, Path, useWatch } from 'react-hook-form';
import { t4_imageCollection } from '@/utils/resourceImage';
import { StyledPaper, MaterialSection } from './StyledComponents';
import { existingResourceSchema, TSimulationFormData } from '../model/schema';
import { useTranslation } from 'react-i18next';

const T4ExistingResources = () => {
  const { t } = useTranslation();
  const { control } = useFormContext<TSimulationFormData>();
  const targetRefine = useWatch({ control, name: 'targetRefine' });
  const { armorType = EArmor.WEAPON, refineNumber = 13 } = targetRefine ?? {};

  const sections: Array<{
    title: string;
    items: Array<{
      key: keyof typeof existingResourceSchema.shape;
      name: string;
      image: keyof typeof t4_imageCollection;
    }>;
  }> = [
    {
      title: t('simulation.materials.t4fragmentAndBook'),
      items: [
        { key: 't4fragment', name: t('simulation.materials.파편'), image: '운명의파편' },
        {
          key: 't4book',
          name: t('simulation.materials.book'),
          image: armorType === EArmor.ARMOR ? '재봉술업화' : '야금술업화',
        },
      ],
    },
    {
      title: t('simulation.materials.stone'),
      items: [
        { key: 't4RedStone', name: t('simulation.materials.운명의파괴석'), image: '운명의파괴석' },
        { key: 't4BlueStone', name: t('simulation.materials.운명의수호석'), image: '운명의수호석' },
        {
          key: 't4BlueCommonStone',
          name: t('simulation.materials.운돌'),
          image: '운명의돌파석',
        },
      ],
    },
    {
      title: t('simulation.materials.refinementStone'),
      items: [
        {
          key: 't4refinementStoneHigh',
          name: t('simulation.materials.용암의숨결'),
          image: '용암의숨결',
        },
        {
          key: 't4refinementStoneMedium',
          name: t('simulation.materials.빙하의숨결'),
          image: '빙하의숨결',
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
                    <MaterialIcon src={t4_imageCollection[item.image]} name={item.name} size={32} />
                    <FormInput<TSimulationFormData, Path<TSimulationFormData>>
                      name={`existingResources.${item.key}`}
                      control={control}
                      placeholder={item.name}
                      numberFormat
                      fullWidth
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
