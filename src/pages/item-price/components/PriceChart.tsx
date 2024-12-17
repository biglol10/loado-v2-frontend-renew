import { styled, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
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

const StyledLabel = styled(Typography)`
  font-style: italic;
  color: ${({ color }) => color};
`;

const PriceChart = ({ data }: any) => {
  const { t } = useTranslation();

  return (
    <ResponsiveContainer>
      <ComposedChart data={[]}>
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="date" scale="band" />
        <YAxis />
        <Tooltip content={<></>} />
        <Legend
          payload={[
            {
              value: (
                <StyledLabel color={colorMapping.avgCurrentMinPrice}>
                  {t('item-price.table.columns.avg-price')}
                </StyledLabel>
              ),
              type: 'rect',
              color: colorMapping.avgCurrentMinPrice,
            },
            {
              value: (
                <StyledLabel color={colorMapping.minCurrentMinPrice}>
                  {t('item-price.table.columns.min-price')}
                </StyledLabel>
              ),
              type: 'line',
              color: colorMapping.minCurrentMinPrice,
            },
            {
              value: (
                <StyledLabel color={colorMapping.maxCurrentMinPrice}>
                  {t('item-price.table.columns.max-price')}
                </StyledLabel>
              ),
              type: 'rect',
              color: colorMapping.maxCurrentMinPrice,
            },
          ]}
        />
        <Bar dataKey="minCurrentMinPrice" barSize={16} fill={colorMapping.minCurrentMinPrice} />
        <Line
          type="monotone"
          dataKey="avgCurrentMinPrice"
          stroke={colorMapping.avgCurrentMinPrice}
        />
        <Scatter dataKey="maxCurrentMinPrice" fill={colorMapping.maxCurrentMinPrice} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default PriceChart;
