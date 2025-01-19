import { Box, Container, Grid, styled, Typography } from '@mui/material';
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
import { colorMapping } from '../const/priceChartConsts';
import { IGraphData } from '../types';
import { cloneDeep } from 'lodash';
import dayjs from 'dayjs';
import PriceTable from './PriceTable';
import PriceTooltip from './PriceTooltip';

interface IPriceChart {
  data: IGraphData[];
  isMobile: boolean;
}

const StyledLabel = styled(Typography)`
  font-style: italic;
  color: ${({ color }) => color};
`;

const ChartTitle = styled(Typography)({
  fontFamily: "'Inter', 'Roboto', sans-serif",
  fontSize: '1rem',
  fontWeight: 500,
  letterSpacing: '0.02rem',
});

const PriceChart = ({ data, isMobile }: IPriceChart) => {
  const { t } = useTranslation();

  const cloneArr = cloneDeep(data).sort((a, b) => {
    const dateA = dayjs(a.date);
    const dateB = dayjs(b.date);
    return dateA.isBefore(dateB) ? -1 : dateA.isAfter(dateB) ? 1 : 0;
  });

  const chartData =
    isMobile && cloneArr.length > 15
      ? [cloneArr.slice(0, cloneArr.length / 2), cloneArr.slice(cloneArr.length / 2)]
      : [cloneArr];

  const getMonthWithDayValue = (value: string) => {
    return dayjs(value).format('MM-DD');
  };

  return (
    <Container
      sx={{
        maxHeight: '80vh',
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255,255,255,0.3)',
          borderRadius: '4px',
          '&:hover': {
            background: 'rgba(255,255,255,0.5)',
          },
        },
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(255,255,255,0.3) rgba(255,255,255,0.1)',
        padding: '0px !important', // container의 기본 padding 제거
      }}
    >
      <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} rowSpacing={{ xs: 2, md: 0 }} xs={12}>
        <Grid item xs={12} md={8}>
          {chartData.map((dataSlice, idx) => (
            <Box
              key={`chart_${idx}`}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                padding: 2,
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s',
              }}
            >
              <ChartTitle
                variant="h6"
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mb: 2,
                  color: 'rgba(255,255,255,0.87)',
                  fontWeight: 500,
                }}
              >
                {t('item-price.chart.period')}:{' '}
                {`${getMonthWithDayValue(dataSlice[0].date)} ~ ${getMonthWithDayValue(dataSlice[dataSlice.length - 1].date)}`}
              </ChartTitle>
              <Box sx={{ height: 500 }}>
                <ResponsiveContainer>
                  <ComposedChart data={data}>
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis dataKey="date" scale="band" />
                    <YAxis />
                    <Tooltip content={<PriceTooltip />} />
                    <Legend
                      payload={[
                        {
                          value: (
                            <StyledLabel color={colorMapping.minCurrentMinPrice}>
                              {t('item-price.table.price-list.min')}
                            </StyledLabel>
                          ),
                          type: 'rect',
                          color: colorMapping.minCurrentMinPrice,
                        },
                        {
                          value: (
                            <StyledLabel color={colorMapping.avgCurrentMinPrice}>
                              {t('item-price.table.price-list.avg')}
                            </StyledLabel>
                          ),
                          type: 'line',
                          color: colorMapping.avgCurrentMinPrice,
                        },
                        {
                          value: (
                            <StyledLabel color={colorMapping.maxCurrentMinPrice}>
                              {t('item-price.table.price-list.max')}
                            </StyledLabel>
                          ),
                          type: 'rect',
                          color: colorMapping.maxCurrentMinPrice,
                        },
                      ]}
                    />
                    <Bar
                      dataKey="minCurrentMinPrice"
                      barSize={16}
                      fill={colorMapping.minCurrentMinPrice}
                    />
                    <Line
                      type="monotone"
                      dataKey="avgCurrentMinPrice"
                      stroke={colorMapping.avgCurrentMinPrice}
                    />
                    <Scatter dataKey="maxCurrentMinPrice" fill={colorMapping.maxCurrentMinPrice} />
                  </ComposedChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          ))}
        </Grid>
        <Grid item xs={12} md={4}>
          <PriceTable data={cloneArr} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default PriceChart;
