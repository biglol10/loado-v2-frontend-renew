import { t3_imageCollection, t4_imageCollection } from '@/utils/resourceImage';
import { existingResourceSchema } from '../model/schema';
import { useTranslation } from 'react-i18next';
import { EArmor } from '../const/simulationConsts';
import { useCallback, useMemo } from 'react';
import { requiredRefineMaterialsData } from '../const/requiredRefineMaterialsData';

export interface ITierResourceConsumptionSection<T, K> {
  title: string;
  items: {
    key: T;
    name: string;
    image: K;
    mappingValue: string;
  }[];
}

export interface ITierExistingResourceSection<T, K> {
  title: string;
  items: {
    key: T;
    name: string;
    image: K;
  }[];
}

const useSimulationConsts = (armorType: EArmor = EArmor.WEAPON) => {
  const { t } = useTranslation();

  const t3ResourceConsumtionSections = useMemo<
    ITierResourceConsumptionSection<
      keyof typeof existingResourceSchema.shape,
      keyof typeof t3_imageCollection
    >[]
  >(() => {
    const isWeapon = armorType === EArmor.WEAPON;

    return [
      {
        title: t('simulation.materials.fragmentAndBook'),
        items: [
          {
            key: 't3fragment',
            name: t('simulation.materials.fragment'),
            image: '명예의파편',
            mappingValue: '파편',
          },
          {
            key: 't3book',
            name: t('simulation.materials.book'),
            image: '책',
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
            key: isWeapon ? 't3RedStone' : 't3BlueStone',
            name: t(`simulation.materials.${isWeapon ? 'redStone' : 'blueStone'}`),
            image: isWeapon ? '파괴석' : '수호석',
            mappingValue: '기본강화재료1',
          },
          //   {
          //     key: 't3BlueStone',
          //     name: t('simulation.materials.blueStone'),
          //     image: '수호석',
          //     mappingValue: '기본강화재료1',
          //   },
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
  }, [armorType, t]);

  const t3ExistingResourceSections = useMemo<
    ITierExistingResourceSection<
      keyof typeof existingResourceSchema.shape,
      keyof typeof t3_imageCollection
    >[]
  >(() => {
    return [
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
  }, [t]);

  const t4ResourceConsumtionSections = useMemo<
    ITierResourceConsumptionSection<
      keyof typeof existingResourceSchema.shape,
      keyof typeof t4_imageCollection
    >[]
  >(() => {
    const isWeapon = armorType === EArmor.WEAPON;

    return [
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
            image: isWeapon ? '야금술업화' : '재봉술업화',
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
            key: isWeapon ? 't4RedStone' : 't4BlueStone',
            name: t(`simulation.materials.${isWeapon ? '운명의파괴석' : '운명의수호석'}`),
            image: isWeapon ? '운명의파괴석' : '운명의수호석',
            mappingValue: '기본강화재료1',
          },
          //   {
          //     key: 't4BlueStone',
          //     name: t('simulation.materials.운명의수호석'),
          //     image: '운명의수호석',
          //     mappingValue: '기본강화재료1',
          //   },
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
            key: isWeapon ? 't4BreathStoneRed' : 't4BreathStoneBlue',
            name: t(`simulation.materials.${isWeapon ? '용암의숨결' : '빙하의숨결'}`),
            image: isWeapon ? '용암의숨결' : '빙하의숨결',
            mappingValue: '숨결1',
          },
          //   {
          //     key: 't4BreathStoneBlue',
          //     name: t('simulation.materials.빙하의숨결'),
          //     image: '빙하의숨결',
          //     mappingValue: '숨결1',
          //   },
        ],
      },
    ];
  }, [armorType, t]);

  const t4ExistingResourceSections = useMemo<
    ITierExistingResourceSection<
      keyof typeof existingResourceSchema.shape,
      keyof typeof t4_imageCollection
    >[]
  >(() => {
    return [
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
          {
            key: 't4RedStone',
            name: t('simulation.materials.운명의파괴석'),
            image: '운명의파괴석',
          },
          {
            key: 't4BlueStone',
            name: t('simulation.materials.운명의수호석'),
            image: '운명의수호석',
          },
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
            key: 't4BreathStoneRed',
            name: t('simulation.materials.용암의숨결'),
            image: '용암의숨결',
          },
          {
            key: 't4BreathStoneBlue',
            name: t('simulation.materials.빙하의숨결'),
            image: '빙하의숨결',
          },
        ],
      },
    ];
  }, [armorType, t]);

  const getObjectToGetValuesFrom = useCallback(
    (armorType: EArmor, refineNumber: number, mappingValue: string, tier: 't3_1' | 't4_1') => {
      return requiredRefineMaterialsData[armorType.toLocaleLowerCase()][tier]?.[refineNumber]?.[
        mappingValue
      ];
    },
    []
  );

  return {
    t3ResourceConsumtionSections,
    t3ExistingResourceSections,
    t4ResourceConsumtionSections,
    t4ExistingResourceSections,
    getObjectToGetValuesFrom,
  };
};

export default useSimulationConsts;
