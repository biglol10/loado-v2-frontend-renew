import { TSimulationFormData } from '../model/schema';

export interface ISimulationResult {
  tryCount: number;
  lastRefine: boolean;
  memoryArr: ISimulationMemory[];
  isFullCount: boolean;
  isFullSoom: boolean;
}

interface ISimulationMemory {
  successProbability: number;
  artisanEnergy: string;
  tryCount: number;
  startProbability: number;
}

interface IProbabilityFactors {
  baseRate: number;
  bookRate: number;
  fullSoomRate: number;
  additionalRate: number;
}

const ARTISAN_ENERGY_MULTIPLIER = 2.15;
const MAX_ARTISAN_ENERGY = 100;
const MAX_RETRY_BONUS_COUNT = 10;

const generateRandomProbability = () => {
  return parseFloat((Math.random() * 100).toFixed(1));
};

/**
 * 주어진 성공 확률에 따라 강화 성공 여부 판단
 */
const determineRefineSuccess = (successProbability: number) => {
  const threshold = 100 - successProbability;
  return generateRandomProbability() >= threshold;
};

/**
 * 현재 시도 횟수에 따른 추가 확률 계산
 */
const calculateRetryBonus = (tryCount: number, baseSuccessRate: number) => {
  const retryCount = tryCount - 1;
  return retryCount > MAX_RETRY_BONUS_COUNT
    ? baseSuccessRate
    : (retryCount * baseSuccessRate) / MAX_RETRY_BONUS_COUNT;
};

/**
 * 풀숨 적용 시 추가되는 확률 계산
 */
const calculateFullSoomBonus = (
  isFullSoom: boolean,
  refineNumber: number,
  baseSuccessRate: number
) => {
  if (!isFullSoom) return 0;
  return refineNumber > 23 ? 1 : baseSuccessRate;
};

/**
 * 현재 강화 시도의 성공 확률 계산
 */
const calculateSuccessProbability = (
  factors: IProbabilityFactors,
  startProbability: number,
  tryCount: number,
  refineNumber: number,
  isFullSoom: boolean
) => {
  const maxProbability =
    factors.baseRate * 2 +
    factors.bookRate +
    calculateFullSoomBonus(isFullSoom, refineNumber, factors.baseRate);

  if (startProbability > maxProbability) {
    return maxProbability;
  }

  const retryBonus = calculateRetryBonus(tryCount, factors.baseRate);
  const fullSoomBonus = calculateFullSoomBonus(isFullSoom, refineNumber, factors.baseRate);

  return factors.baseRate + retryBonus + factors.bookRate + fullSoomBonus;
};

/**
 * 장인의 기운 증가량 계산
 */
const calculateArtisanEnergy = (successProbability: number, isArtisanEnergyTwice: boolean) => {
  const baseEnergy = successProbability / ARTISAN_ENERGY_MULTIPLIER;
  return isArtisanEnergyTwice ? baseEnergy * 2 : baseEnergy;
};

/**
 * 강화 시뮬레이션 실행
 */
export const refineSimulation = (
  refineObject: TSimulationFormData,
  tryCount: number,
  startProbability: number,
  startArtisanEnergy: number,
  memoryArr: ISimulationMemory[] = []
): ISimulationResult => {
  const { probability, targetRefine } = refineObject;

  const {
    baseSuccessRate,
    bookProbability,
    artisanEnergy,
    isFullSoom,
    isUseBook,
    additionalSuccessRate,
    isArtisanEnergyTwice,
  } = probability;

  // Validation
  if (additionalSuccessRate > 0 && startArtisanEnergy <= 0) {
    throw new Error('장인의 기운이 0이면 추가 재련 확률을 적용할 수 없습니다.');
  }

  // Calculate success probability
  const probabilityFactors: IProbabilityFactors = {
    baseRate: baseSuccessRate,
    bookRate: isUseBook ? bookProbability : 0,
    fullSoomRate: calculateFullSoomBonus(isFullSoom, targetRefine.refineNumber, baseSuccessRate),
    additionalRate: additionalSuccessRate,
  };

  const successProbability = calculateSuccessProbability(
    probabilityFactors,
    startProbability,
    tryCount,
    targetRefine.refineNumber,
    isFullSoom
  );

  // Determine success and calcualte artisan energy
  const isSuccess = determineRefineSuccess(successProbability);
  const bonusArtisanEnergy = calculateArtisanEnergy(successProbability, isArtisanEnergyTwice);
  const newArtisanEnergy = (startArtisanEnergy + bonusArtisanEnergy).toFixed(2);

  // Record attempt
  memoryArr.push({
    successProbability,
    artisanEnergy: startArtisanEnergy.toFixed(2),
    tryCount,
    startProbability,
  });

  // Handle success case
  if (isSuccess) {
    return {
      tryCount,
      lastRefine: false,
      memoryArr,
      isFullCount: false,
      isFullSoom,
    };
  }

  // Handle artisan energy full case
  if (Number(newArtisanEnergy) >= MAX_ARTISAN_ENERGY) {
    memoryArr.push({
      successProbability,
      artisanEnergy: MAX_ARTISAN_ENERGY.toFixed(2),
      tryCount: tryCount + 1,
      startProbability,
    });

    return {
      tryCount: tryCount + 1,
      lastRefine: true,
      memoryArr,
      isFullCount: true,
      isFullSoom,
    };
  }

  // Continue simulation
  return refineSimulation(
    refineObject,
    tryCount + 1,
    successProbability,
    startArtisanEnergy + bonusArtisanEnergy,
    memoryArr
  );
};
