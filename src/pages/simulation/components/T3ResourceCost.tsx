import { Grid, Typography } from '@mui/material';
import MaterialIcon from './MaterialIcon';
import FormInput from '@/components/common/FormInput';
import { useFormContext, Path, useWatch, useForm } from 'react-hook-form';
import { t3_imageCollection } from '@/utils/resourceImage';
import { StyledPaper, MaterialSection } from './StyledComponents';
import { existingResourceSchema, TResourceCostData, TSimulationFormData } from '../model/schema';
import { useTranslation } from 'react-i18next';
import { requiredRefineMaterialsData } from '../const/requiredRefineMaterialsData';

const T3ResourceCost = () => {
  const { t } = useTranslation();
  const { control } = useFormContext<TSimulationFormData>();
  const { control: resourceCostControl, setValue } = useFormContext<TResourceCostData>();
  const { refineNumber, armorType } = useWatch({ control, name: 'targetRefine' });

  const sections: Array<{
    title: string;
    items: Array<{
      key: keyof typeof existingResourceSchema.shape;
      name: string;
      image: keyof typeof t3_imageCollection;
      mappingValue: string;
    }>;
  }> = [
    {
      title: t('simulation.materials.fragmentAndBook'),
      items: [
        {
          key: 't3fragment',
          name: t('simulation.materials.fragment'),
          image: '명예의파편',
          mappingValue: '파편',
        },
        { key: 't3book', name: t('simulation.materials.book'), image: '책', mappingValue: 'book' },
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
          key: 't3RedStone',
          name: t('simulation.materials.redStone'),
          image: '파괴석',
          mappingValue: '기본강화재료1',
        },
        {
          key: 't3BlueStone',
          name: t('simulation.materials.blueStone'),
          image: '수호석',
          mappingValue: '기본강화재료1',
        },
        {
          key: 't3BlueCommonStone',
          name: t('simulation.materials.blueCommonStone'),
          image: '찬명돌',
          mappingValue: '기본강화재료2',
        },
        {
          key: 't3FusionMaterial',
          name: t('simulation.materials.최상급오레하'),
          image: '오레하',
          mappingValue: '기본강화재료3',
        },
      ],
    },
    {
      title: t('simulation.materials.refinementStone'),
      items: [
        {
          key: 't3BreathStoneHigh',
          name: t('simulation.materials.solarGrace'),
          image: '가호',
          mappingValue: '숨결3',
        },
        {
          key: 't3BreathStoneMedium',
          name: t('simulation.materials.solarBlessing'),
          image: '축복',
          mappingValue: '숨결2',
        },
        {
          key: 't3BreathStoneLow',
          name: t('simulation.materials.solarProtection'),
          image: '은총',
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
                    requiredRefineMaterialsData[armorType.toLocaleLowerCase()]['t3_1']?.[
                      refineNumber
                    ]?.[item.mappingValue] ?? 0;
                } else {
                  defaultValue =
                    requiredRefineMaterialsData[armorType.toLocaleLowerCase()]['t3_1']?.[
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
                        src={t3_imageCollection[item.image]}
                        name={item.name}
                        size={32}
                      />
                      <FormInput<TResourceCostData, Path<TResourceCostData>>
                        name={`${item.key}`}
                        control={resourceCostControl}
                        // placeholder={item.name}
                        numberFormat={item.mappingValue !== 'book'}
                        fullWidth
                        label={item.name}
                        id={`${item.key}_cost`}
                        percentageFormat={item.mappingValue === 'book'}
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

export default T3ResourceCost;
