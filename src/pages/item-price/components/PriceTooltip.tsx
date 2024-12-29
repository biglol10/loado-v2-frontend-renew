import { TooltipProps } from 'recharts';
import { Payload } from 'recharts/types/component/DefaultTooltipContent';
import { Box, Typography, Divider, styled } from '@mui/material';
import { alpha } from '@mui/material';
import { colorMapping } from '../const/priceChartConsts';
import GoldImage from '@/assets/images/goldImage_noBackground.webp';
import React from 'react';
import { useTranslation } from 'react-i18next';

type TLabelName = 'minCurrentMinPrice' | 'avgCurrentMinPrice' | 'maxCurrentMinPrice';
type PriceTooltipProps = TooltipProps<number, TLabelName>;

const TooltipBox = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.95),
  borderRadius: theme.shape.borderRadius * 1.5,
  padding: theme.spacing(2),
  boxShadow: theme.shadows[4],
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  backdropFilter: 'blur(8px)',
  minWidth: 150,
}));

const PriceItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

const PriceLabel = styled(Typography)<{ color?: string }>(({ theme, color }) => ({
  fontWeight: 600,
  color: color || theme.palette.primary.main,
  fontSize: '0.875rem',
}));

const PriceValue = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

const getValueByDataKey = (payload: Array<Payload<number, TLabelName>>, dataKey: TLabelName) => {
  const entry = payload.find((entry) => entry.dataKey === dataKey);

  return entry ? entry.value : null;
};

const PriceTooltip = (props: PriceTooltipProps) => {
  const { active, payload, label } = props;
  const { t } = useTranslation();

  if (active && label && payload && payload.length) {
    const minPrice = getValueByDataKey(payload, 'minCurrentMinPrice') ?? 0;
    const avgPrice = getValueByDataKey(payload, 'avgCurrentMinPrice') ?? 0;
    const maxPrice = getValueByDataKey(payload, 'maxCurrentMinPrice') ?? 0;

    return (
      <TooltipBox>
        <Typography variant="subtitle1" fontWeight="bold">
          {label}
        </Typography>
        <Divider sx={{ my: 1.5 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <PriceItem>
            <PriceLabel color={colorMapping.minCurrentMinPrice}>
              {t('item-price.chart.legend.max')}
            </PriceLabel>
            <PriceValue>
              {maxPrice.toLocaleString()}
              <Box component="img" src={GoldImage} sx={{ width: 20, height: 20 }} />
            </PriceValue>
          </PriceItem>

          <PriceItem>
            <PriceLabel color={colorMapping.avgCurrentMinPrice}>
              {t('item-price.chart.legend.avg')}
            </PriceLabel>
            <PriceValue>
              {Number(avgPrice.toFixed(2)).toLocaleString()}
              <Box component="img" src={GoldImage} sx={{ width: 20, height: 20 }} />
            </PriceValue>
          </PriceItem>

          <PriceItem>
            <PriceLabel color={colorMapping.minCurrentMinPrice}>
              {t('item-price.chart.legend.min')}
            </PriceLabel>
            <PriceValue>
              {minPrice.toLocaleString()}
              <Box component="img" src={GoldImage} sx={{ width: 20, height: 20 }} />
            </PriceValue>
          </PriceItem>
        </Box>
      </TooltipBox>
    );
  }
};

const areEqualProps = (
  prevProps: Pick<PriceTooltipProps, 'label'>,
  nextProps: Pick<PriceTooltipProps, 'label'>
) => {
  return prevProps.label === nextProps.label;
};

export default React.memo(PriceTooltip, areEqualProps);
