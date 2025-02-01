import { z } from 'zod';
import { EArmor } from '../const/simulationConsts';

const optionalNumberDefaultZero = z.number().optional().default(0);

const percentageSchema = z
  .number()
  .min(0, '확률은 0보다 작을 수 없습니다')
  .max(100, '확률은 100을 초과할 수 없습니다')
  .optional()
  .default(0);

// 귀속재료 스키마
export const existingResourceSchema = z.object({
  refineGold: z.number().optional().default(0),
  t4fragment: optionalNumberDefaultZero,
  t4RedStone: optionalNumberDefaultZero,
  t4BlueStone: optionalNumberDefaultZero,
  t4BlueCommonStone: optionalNumberDefaultZero,
  t4FusionMaterial: optionalNumberDefaultZero,
  t4BreathStoneRed: optionalNumberDefaultZero,
  t4BreathStoneBlue: optionalNumberDefaultZero,
  t4book: optionalNumberDefaultZero,
  t3fragment: optionalNumberDefaultZero,
  t3RedStone: optionalNumberDefaultZero,
  t3BlueStone: optionalNumberDefaultZero,
  t3BlueCommonStone: optionalNumberDefaultZero,
  t3FusionMaterial: optionalNumberDefaultZero,
  t3BreathStoneHigh: optionalNumberDefaultZero,
  t3BreathStoneMedium: optionalNumberDefaultZero,
  t3BreathStoneLow: optionalNumberDefaultZero,
  t3book: optionalNumberDefaultZero,
});

// 재료값 스키마
export const resourceConsumptionSchema = z.object({
  refineGold: z.number().min(1),
  t4fragment: optionalNumberDefaultZero,
  t4RedStone: optionalNumberDefaultZero,
  t4BlueStone: optionalNumberDefaultZero,
  t4BlueCommonStone: optionalNumberDefaultZero,
  t4FusionMaterial: optionalNumberDefaultZero,
  t4BreathStoneRed: optionalNumberDefaultZero,
  t4BreathStoneBlue: optionalNumberDefaultZero,
  t4book: optionalNumberDefaultZero,
  t3fragment: optionalNumberDefaultZero,
  t3RedStone: optionalNumberDefaultZero,
  t3BlueStone: optionalNumberDefaultZero,
  t3BlueCommonStone: optionalNumberDefaultZero,
  t3FusionMaterial: optionalNumberDefaultZero,
  t3BreathStoneHigh: optionalNumberDefaultZero,
  t3BreathStoneMedium: optionalNumberDefaultZero,
  t3BreathStoneLow: optionalNumberDefaultZero,
  t3book: optionalNumberDefaultZero,
});

export const resourcePriceSchema = z.object({
  refineGold_price: z.number().min(1),
  t4fragment_price: optionalNumberDefaultZero,
  t4RedStone_price: optionalNumberDefaultZero,
  t4BlueStone_price: optionalNumberDefaultZero,
  t4BlueCommonStone_price: optionalNumberDefaultZero,
  t4FusionMaterial_price: optionalNumberDefaultZero,
  t4BreathStoneRed_price: optionalNumberDefaultZero,
  t4BreathStoneBlue_price: optionalNumberDefaultZero,
  t4book_price: optionalNumberDefaultZero,
  t3fragment_price: optionalNumberDefaultZero,
  t3RedStone_price: optionalNumberDefaultZero,
  t3BlueStone_price: optionalNumberDefaultZero,
  t3BlueCommonStone_price: optionalNumberDefaultZero,
  t3FusionMaterial_price: optionalNumberDefaultZero,
  t3BreathStoneHigh_price: optionalNumberDefaultZero,
  t3BreathStoneMedium_price: optionalNumberDefaultZero,
  t3BreathStoneLow_price: optionalNumberDefaultZero,
  t3book_price: optionalNumberDefaultZero,
});

// 확률정보 스키마
export const probabilityInfoSchema = z.object({
  baseSuccessRate: percentageSchema,
  additionalSuccessRate: percentageSchema,
  artisanEnergy: percentageSchema,
  bookProbability: percentageSchema,
  isUseBook: z.boolean().optional().default(false),
  isFullSoom: z.boolean().optional().default(false),
  isArtisanEnergyTwice: z.boolean().optional().default(false),
});

// 목표 재련 스키마
export const targetRefineSchema = z.object({
  armorType: z.enum(['WEAPON', 'ARMOR']).transform((val): EArmor => val as EArmor),
  refineNumber: z.number(),
  tier: z.enum(['T3', 'T4']),
});

// 통합 스키마
export const simulationFormSchema = z.object({
  existingResources: existingResourceSchema,
  probability: probabilityInfoSchema,
  targetRefine: targetRefineSchema,
  resourceConsumption: resourceConsumptionSchema.optional(),
  resourcePrice: resourcePriceSchema.optional(),
});

export type TTargetRefineInfoData = z.infer<typeof targetRefineSchema>;
export type TSimulationFormData = z.infer<typeof simulationFormSchema>;
export type TResourceConsumptionData = z.infer<typeof resourceConsumptionSchema>;
export type TResourcePriceData = z.infer<typeof resourcePriceSchema>;
