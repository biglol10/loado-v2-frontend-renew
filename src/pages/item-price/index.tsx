import { Grid, Paper, Box, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useMemo, useState } from 'react';
import * as ComponentTypes from '@/apis/itemPrice/types';
import { useItemPriceQuery } from '@/apis/itemPrice/useItemPriceQuery';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import ComponentWithSkeleton from '../../components/atomic/ComponentWithSkeleton';
import DensePriceTable from './DensePriceTable';
import { StyledToolbar } from '../home/styles/styles';
import itemPriceStore from '@/store/item-price/itemPriceStore';
import { useTranslation } from 'react-i18next';
import SingleItemPriceModal from './modal/SingleItemPriceModal';
import { StyledTabs, StyledTab } from '@/components/common/CustomTab';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

// const SingleItemPriceModal = lazy(() => import('./modal/SingleItemPriceModal'));

const ItemPricePage = () => {
  const { t } = useTranslation();
  const { selectedItemToView } = itemPriceStore();

  const [activeTab, setActiveTab] = useState<ComponentTypes.TActiveTabType>('ALL');

  const { data: queryResults, isLoading } = useItemPriceQuery({
    searchDate: dayjs().format('YYYY-MM-DD'),
    staleTime: 1000 * 60 * 5,
  });

  // 서버 데이터에서 파생되는 값이므로 별도 state로 복제하지 않고 useMemo로 계산한다.
  const { engravings, refinement, refinementAdditional, esder, jewelry } = useMemo(() => {
    const grouped = {
      engravings: [] as ComponentTypes.IItemData[],
      refinement: [] as ComponentTypes.IItemData[],
      refinementAdditional: [] as ComponentTypes.IItemData[],
      esder: [] as ComponentTypes.IItemData[],
      jewelry: [] as ComponentTypes.IItemData[],
    };

    queryResults.forEach((resp) => {
      const rows = resp?.data;
      if (!rows || rows.length === 0) return;

      // 캐시 원본 배열을 직접 정렬하지 않도록 복사 후 정렬한다.
      const sorted = [...rows].sort((a, b) => b.minCurrentMinPrice - a.minCurrentMinPrice);

      switch (sorted[0]?.categoryCode) {
        case 44410:
          grouped.engravings = sorted;
          break;
        case 50010:
          grouped.refinement = sorted;
          break;
        case 50020:
          grouped.refinementAdditional = sorted;
          break;
        case 51100:
          grouped.esder = sorted;
          break;
        case 210000:
          grouped.jewelry = sorted;
          break;
        default:
          break;
      }
    });

    return grouped;
  }, [queryResults]);

  const handleTabChange = (_: React.SyntheticEvent, value: ComponentTypes.TActiveTabType) => {
    setActiveTab(value);
  };

  return (
    <>
      <Box sx={{ width: '100%', bgcolor: 'background.paper', marginTop: '50px' }}>
        <Container maxWidth="lg">
          <StyledToolbar variant="dense" disableGutters>
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 0,
              }}
            >
              <StyledTabs value={activeTab} onChange={handleTabChange}>
                <StyledTab label={t('item-price.label.tab1')} value={'ALL'} />
                <StyledTab label={t('item-price.label.tab2')} value={'T3'} />
                <StyledTab label={t('item-price.label.tab3')} value={'T4'} />
              </StyledTabs>
            </Box>
          </StyledToolbar>
        </Container>

        <Box sx={{ width: '100%', padding: '50px' }}>
          <Grid container columnSpacing={{ xs: 1, sm: 2, md: 10 }} xs={12}>
            <Grid item xs={6}>
              <Item>
                <Grid container rowSpacing={5}>
                  <Grid item xs={12}>
                    <ComponentWithSkeleton
                      sx={{ height: 250 }}
                      animation="wave"
                      variant="rectangular"
                      isLoading={isLoading}
                    >
                      <DensePriceTable
                        title={t('item-price.table.title.refinement')}
                        rows={refinement}
                        activeTab={activeTab}
                      />
                    </ComponentWithSkeleton>
                  </Grid>
                  <Grid item xs={12}>
                    <ComponentWithSkeleton
                      sx={{ height: 250 }}
                      animation="wave"
                      variant="rectangular"
                      isLoading={isLoading}
                    >
                      <DensePriceTable
                        title={t('item-price.table.title.refinement-additional')}
                        rows={refinementAdditional}
                        activeTab={activeTab}
                      />
                    </ComponentWithSkeleton>
                  </Grid>
                  <Grid item xs={12}>
                    <ComponentWithSkeleton
                      sx={{ height: 250 }}
                      animation="wave"
                      variant="rectangular"
                      isLoading={isLoading}
                    >
                      <DensePriceTable
                        title={t('item-price.table.title.esder-gem')}
                        rows={[...esder, ...jewelry]}
                        activeTab={activeTab}
                      />
                    </ComponentWithSkeleton>
                  </Grid>
                </Grid>
              </Item>
            </Grid>
            <Grid item xs={6}>
              <Item>
                <Grid container rowSpacing={5}>
                  <Grid item xs={12}>
                    <ComponentWithSkeleton
                      sx={{ height: 250 }}
                      animation="wave"
                      variant="rectangular"
                      isLoading={isLoading}
                    >
                      <DensePriceTable
                        title={t('item-price.table.title.engraving')}
                        rows={engravings}
                        type="book"
                      />
                    </ComponentWithSkeleton>
                  </Grid>
                </Grid>
              </Item>
            </Grid>
          </Grid>
        </Box>
        <Outlet />
      </Box>
      {selectedItemToView && <SingleItemPriceModal />}
      {/* Suspense로 안 감싸면 FallbackLoader가 표시되면서 화면이 리랜더링 */}
      {/* {selectedItemToView && (
        <Suspense>
          <SingleItemPriceModal />
        </Suspense>
      )} */}
    </>
  );
};

export default ItemPricePage;
