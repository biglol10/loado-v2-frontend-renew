import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
} from '@mui/material';
import ArrowCircleDownTwoTone from '@mui/icons-material/ArrowCircleDownTwoTone';
import ArrowCircleUpTwoTone from '@mui/icons-material/ArrowCircleUpTwoTone';
import { IGraphData } from '../types';
import GoldImage from '@/assets/images/goldImage_noBackground.webp';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { cloneDeep } from 'lodash';
import dayjs from 'dayjs';

const ModernTypography = styled(Typography)<{ active?: boolean }>(({ theme, active }) => ({
  fontFamily: 'Inter',
  fontSize: '0.875rem',
  letterSpacing: '0.01em',
  transition: 'color 0.2s',
  color: active ? 'aquamarine' : 'inherit',
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

interface PriceTableProps {
  data: IGraphData[];
}

type TSort = 'ASC' | 'DESC';
type TActiveHead = 'MIN' | 'AVG' | 'MAX';

const PriceTable = ({ data }: PriceTableProps) => {
  const { t } = useTranslation();

  const [dateSortDirection, setDateSortDirection] = useState<TSort>('ASC');
  const [activeHead, setActiveHead] = useState<TActiveHead>('MIN');

  const columnsToDisplay = (() => {
    if (activeHead === 'MIN') {
      return ['date', 'minCurrentMinPrice'];
    } else if (activeHead === 'AVG') {
      return ['date', 'avgCurrentMinPrice'];
    } else {
      return ['date', 'maxCurrentMinPrice'];
    }
  })();

  const dateSortedData = useMemo(() => {
    return cloneDeep(data).sort((a, b) => {
      const dateA = dayjs(a.date);
      const dateB = dayjs(b.date);

      if (dateSortDirection === 'ASC') {
        return dateA.isBefore(dateB) ? -1 : dateA.isAfter(dateB) ? 1 : 0;
      } else {
        return dateA.isBefore(dateB) ? 1 : dateA.isAfter(dateB) ? -1 : 0;
      }
    });
  }, [data, dateSortDirection]);

  return (
    <TableContainer
      sx={{
        maxHeight: 500,
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: '12px',
        '& .MuiTable-root': {
          width: '100%',
        },
        '& .MuiTableHead-root': {
          '& .MuiTableCell-root': {
            color: 'rgba(255,255,255,0.87)',
            fontWeight: 500,
          },
        },
        '& .MuiTableBody-root': {
          '& .MuiTableRow-root': {
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.05) !important',
            },
            '& .MuiTableCell-root': {
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            },
          },
        },
      }}
    >
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ModernTypography>{t('item-price.table.price-list.date')}</ModernTypography>
                {dateSortDirection === 'ASC' ? (
                  <Box sx={{ cursor: 'pointer' }} onClick={() => setDateSortDirection('DESC')}>
                    <ArrowCircleDownTwoTone sx={{ fontSize: '1.1rem', marginLeft: '5px' }} />
                  </Box>
                ) : (
                  <Box sx={{ cursor: 'pointer' }} onClick={() => setDateSortDirection('ASC')}>
                    <ArrowCircleUpTwoTone sx={{ fontSize: '1.1rem', marginLeft: '5px' }} />
                  </Box>
                )}
              </Box>
            </TableCell>
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ModernTypography
                  sx={{ cursor: 'pointer' }}
                  active={activeHead === 'MIN'}
                  onClick={() => setActiveHead('MIN')}
                >
                  {t('item-price.table.price-list.min')}
                </ModernTypography>
                <ModernTypography>/</ModernTypography>
                <ModernTypography
                  sx={{ cursor: 'pointer' }}
                  active={activeHead === 'AVG'}
                  onClick={() => setActiveHead('AVG')}
                >
                  {t('item-price.table.price-list.avg')}
                </ModernTypography>
                <ModernTypography>/</ModernTypography>
                <ModernTypography
                  sx={{ cursor: 'pointer' }}
                  active={activeHead === 'MAX'}
                  onClick={() => setActiveHead('MAX')}
                >
                  {t('item-price.table.price-list.max')}
                </ModernTypography>
              </Box>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dateSortedData.map((item, idx) => {
            return (
              <TableRow
                hover
                role="checkbox"
                tabIndex={-1}
                key={`tableRow-${idx}`}
                sx={{
                  '& td': {
                    padding: '8px 16px',
                  },
                }}
              >
                {columnsToDisplay.map((col, idx2) => (
                  <TableCell key={`${col}_${idx2}`}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.2 }}>
                      {col !== 'date' && (
                        <Box
                          component="img"
                          src={GoldImage}
                          sx={{ height: '25px', width: '25px' }}
                        />
                      )}
                      <ModernTypography>
                        {item[col as keyof IGraphData].toLocaleString().split('.')[0]}
                      </ModernTypography>
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PriceTable;
