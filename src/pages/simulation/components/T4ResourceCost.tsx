import { Grid, Typography } from '@mui/material';
import MaterialIcon from './MaterialIcon';
import FormInput from '@/components/common/FormInput';
import { useFormContext, Path, useWatch, useForm } from 'react-hook-form';
import { t4_imageCollection } from '@/utils/resourceImage';
import { StyledPaper, MaterialSection } from './StyledComponents';
import { existingResourceSchema, TResourceCostData, TSimulationFormData } from '../model/schema';
import { useTranslation } from 'react-i18next';
import { requiredRefineMaterialsData } from '../const/requiredRefineMaterialsData';

const T4ResourceCost = () => {
  const { t } = useTranslation();
  const { control } = useFormContext<TSimulationFormData>();
  const { control: resourceCostControl, setValue } = useFormContext<TResourceCostData>();
  const { refineNumber, armorType } = useWatch({ control, name: 'targetRefine' });

  const sections: Array<{
    title: string;
    items: Array<{
      key: keyof typeof existingResourceSchema.shape;
      name: string;
      image: keyof typeof t4_imageCollection;
      mappingValue: string;
    }>;
  }> = [
    {
      title: t('simulation.materials.fragmentAndBook'),
      items: [
        {
          key: 't4fragment',
          name: t('simulation.materials.운명파편'),
          image: '운명의파편',
          mappingValue: '파편',
        },
        {
          key: 't4book',
          name: t('simulation.materials.book'),
          image: armorType === 'WEAPON' ? '야금술업화' : '재봉술업화',
          mappingValue: 'book',
        },
        {
          key: 'refineGold',
          name: t('simulation.materials.골드'),
          image: '골드',
          mappingValue: 'gold',
        },
      ],
    },
    {
      title: t('simulation.materials.stone'),
      items: [
        {
          key: 't4RedStone',
          name: t('simulation.materials.운명의파괴석'),
          image: '운명의파괴석',
          mappingValue: '기본강화재료1',
        },
        {
          key: 't4BlueStone',
          name: t('simulation.materials.운명의수호석'),
          image: '운명의수호석',
          mappingValue: '기본강화재료1',
        },
        {
          key: 't4BlueCommonStone',
          name: t('simulation.materials.운돌'),
          image: '운명의돌파석',
          mappingValue: '기본강화재료2',
        },
        {
          key: 't4FusionMaterial',
          name: t('simulation.materials.아비도스'),
          image: '아비도스',
          mappingValue: '기본강화재료3',
        },
      ],
    },
    {
      title: t('simulation.materials.용암의숨결'),
      items: [
        {
          key: 't4BreathStoneRed',
          name: t('simulation.materials.용암의숨결'),
          image: '용암의숨결',
          mappingValue: '숨결1',
        },
        {
          key: 't4BreathStoneBlue',
          name: t('simulation.materials.빙하의숨결'),
          image: '빙하의숨결',
          mappingValue: '숨결1',
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
              {section.items.map((item) => {
                let defaultValue;

                if (item.key === 'refineGold') {
                  defaultValue =
                    requiredRefineMaterialsData[armorType.toLocaleLowerCase()]['t4_1']?.[
                      refineNumber
                    ]?.[item.mappingValue] ?? 0;
                } else {
                  defaultValue =
                    requiredRefineMaterialsData[armorType.toLocaleLowerCase()]['t4_1']?.[
                      refineNumber
                    ]?.[item.mappingValue]?.[
                      item.mappingValue === 'book' ? 'probability' : 'count'
                    ] ?? 0;
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
                      <FormInput<TResourceCostData, Path<TResourceCostData>>
                        name={`${item.key}`}
                        control={resourceCostControl}
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

export default T4ResourceCost;
