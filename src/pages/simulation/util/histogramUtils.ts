interface HistogramBins {
  min: number;
  max: number;
  numBins: number;
  binSize: number;
}

interface HistogramCategory {
  range: string;
  count: number;
}

// 구간 개수 동적 설정
const getNumBins = (max: number): number => {
  if (max > 180) return 40;
  if (max > 80) return 30;
  if (max > 25) return 20;
  return max;
};

// 히스토그램 구간 계산
export const calculateHistogramBins = (tryCountList: number[]): HistogramBins => {
  const min = Math.min(...tryCountList);
  const max = Math.max(...tryCountList);
  const numBins = getNumBins(max);
  const binSize = (max - min) / numBins;

  return { min, max, numBins, binSize };
};

// 히스토그램 데이터 생성
export const createHistogramData = (
  tryCountList: number[],
  { min, numBins, binSize, max }: HistogramBins
): HistogramCategory[] => {
  const histogramData = new Array(numBins).fill(0);

  tryCountList.forEach((value: number) => {
    const binIndex = Math.min(Math.floor((value - min) / binSize), numBins - 1);
    histogramData[binIndex] += 1;
  });

  return histogramData.map((count, index) => ({
    range:
      max < 25
        ? `${index + 1}`
        : `${Math.floor(min + index * binSize)}-${
            Math.floor(min + (index + 1) * binSize) - (index + 1 === numBins ? 0 : 1)
          }`,
    count,
  }));
};

// 상위 N% 지점 찾기
export const findTopNPercentPoint = (
  tryCountList: number[],
  histogramData: HistogramCategory[],
  percentPoint: number
): HistogramCategory | undefined => {
  if (!percentPoint || percentPoint > 100 || percentPoint < 1) {
    return undefined;
  }

  const topNPercentIndex = Math.floor((tryCountList.length * percentPoint) / 100);
  const topNPercentValue = tryCountList[topNPercentIndex];

  return histogramData.find((category) => {
    const [rangeMin, rangeMax] = category.range.split('-').map(Number);
    return topNPercentValue >= (rangeMin || 0) && topNPercentValue <= (rangeMax ?? rangeMin);
  });
};
