import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
} from 'recharts';

export const colorMapping = {
  maxCurrentMinPrice: '#4565FF',
  avgCurrentMinPrice: '#ff7300',
  minCurrentMinPrice: '#ECB32B',
};

const PriceChart = () => {
  return (
    <ComposedChart data={[]}>
      <CartesianGrid stroke="#f5f5f5" />
      <XAxis dataKey="date" scale="band" />
      <YAxis />
      <Tooltip content={<></>} />
    </ComposedChart>
  );
};
