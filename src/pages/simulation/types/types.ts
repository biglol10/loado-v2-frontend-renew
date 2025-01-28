type SimulationResultGroupPointResult = {
  range: string;
  count: number;
};

export type SimulationResultGraphData = {
  simulationResultGroupPointResultList: SimulationResultGroupPointResult[];
  topNPercentPointRange?: SimulationResultGroupPointResult;
};
