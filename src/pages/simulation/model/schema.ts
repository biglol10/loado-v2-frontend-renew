import { z } from 'zod';

const optionalNumberDefaultZero = z.number().optional().default(0);

const percentageSchema = z
  .number()
  .int('소수점은 입력할 수 없습니다.')
  .min(0, '확률은 0보다 작을 수 없습니다')
  .max(100, '확률은 100을 초과할 수 없습니다')
  .default(0);

// 귀속재료 스키마
export const existingResourceSchema = z.object({
  t4fragment: optionalNumberDefaultZero,
  t4RedStone: optionalNumberDefaultZero,
  t4BlueStone: optionalNumberDefaultZero,
  t4BlueCommonStone: optionalNumberDefaultZero,
  t4refinementStoneHigh: optionalNumberDefaultZero,
  t4refinementStoneMedium: optionalNumberDefaultZero,
  t4refinementStoneLow: optionalNumberDefaultZero,
  t4book: optionalNumberDefaultZero,
  t3fragment: optionalNumberDefaultZero,
  t3RedStone: optionalNumberDefaultZero,
  t3BlueStone: optionalNumberDefaultZero,
  t3BlueCommonStone: optionalNumberDefaultZero,
  t3refinementStoneHigh: optionalNumberDefaultZero,
  t3refinementStoneMedium: optionalNumberDefaultZero,
  t3refinementStoneLow: optionalNumberDefaultZero,
  t3book: optionalNumberDefaultZero,
});

// 확률정보 스키마
export const probabilityInfoSchema = z.object({
  baseSuccessRate: percentageSchema,
  additionalSuccessRate: percentageSchema,
  artisanEnergy: percentageSchema,
  bookProbability: percentageSchema,
});

// 통합 스키마
export const simulationFormSchema = z.object({
  existingResources: existingResourceSchema,
  probability: probabilityInfoSchema,
});

export type TSimulationFormData = z.infer<typeof simulationFormSchema>;
