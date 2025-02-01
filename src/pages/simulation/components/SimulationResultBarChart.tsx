import {
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ReferenceLine,
  TooltipProps,
  ResponsiveContainer,
} from 'recharts';
import { SimulationResultGraphData } from '../types/types';
import { Box } from '@mui/material';
import { SectionTitle } from './SectionTitle';
import SimulationResultTooltip from './SimulationResultTooltip';

const SimulationResultBarChart = ({
  topNPercentPointData,
  topNPercentPoint,
}: {
  topNPercentPointData: SimulationResultGraphData;
  topNPercentPoint: number;
}) => {
  const { simulationResultGroupPointResultList, topNPercentPointRange } = topNPercentPointData;

  return (
    <Box
      sx={{
        width: '70%',
        height: 500,
        margin: '0 auto',
        marginTop: '20px',
      }}
    >
      <SectionTitle>시뮬레이션 결과</SectionTitle>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={simulationResultGroupPointResultList} margin={{ top: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip content={<SimulationResultTooltip />} />
          <Legend
            wrapperStyle={{
              position: 'relative',
              top: '-10px',
            }}
            payload={[
              {
                value: '시뮬레이션 결과',
                type: 'star',
                id: 'LegendPayload',
                color: 'gold',
              },
            ]}
          />
          <Bar dataKey="count" fill="#8884d8" background={{ fill: '#0E0F15' }} />
          {topNPercentPointRange && (
            <ReferenceLine
              x={topNPercentPointRange.range}
              stroke="orange"
              label={{ value: `상위 ${topNPercentPoint}%`, position: 'top', stroke: 'orange' }}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default SimulationResultBarChart;
