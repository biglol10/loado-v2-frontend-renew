import { Tab, Tabs, Grid, Paper, Box, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import * as ComponentTypes from '@/apis/itemPrice/types';
import userStore from '@/store/user/userStore';
import { isEmpty } from 'lodash';
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
  const [refinement, setRefinement] = useState<ComponentTypes.IItemData[]>([]);
  const [refinementAdditional, setRefinementAdditional] = useState<ComponentTypes.IItemData[]>([]);
  const [esder, setEsder] = useState<ComponentTypes.IItemData[]>([]);
  const [engravings, setEngravings] = useState<ComponentTypes.IItemData[]>([]);
  const [jewelry, setJewelry] = useState<ComponentTypes.IItemData[]>([]);

  const { isMobile } = userStore();

  const {
    data: queryResults,
    isFetched,
    isLoading,
  } = useItemPriceQuery({
    searchDate: dayjs().format('YYYY-MM-DD'),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (isFetched) {
      queryResults.forEach((query) => {
        const data = query?.data;

        if (!isEmpty(data)) {
          const dataToUse = data!;
          dataToUse.sort((a, b) => b.minCurrentMinPrice - a.minCurrentMinPrice);
          const code = dataToUse.at(0)?.categoryCode;

          switch (code) {
            case 44410:
              setEngravings(dataToUse);
              break;
            case 50010:
              setRefinement(dataToUse);
              break;
            case 50020:
              setRefinementAdditional(dataToUse);
              break;
            case 51100:
              setEsder(dataToUse);
              break;
            case 210000:
              setJewelry(dataToUse);
              break;
            default:
              break;
          }
        }
      });
    }
  }, [queryResults, isFetched]);

  const columns = useMemo(() => {
    if (isMobile) {
      return [
        t('item-price.table.columns.item-name'),
        t('item-price.table.columns.min-price'),
        t('item-price.table.columns.price-check'),
      ];
    } else {
      return [
        t('item-price.table.columns.item-name'),
        t('item-price.table.columns.min-price'),
        t('item-price.table.columns.avg-price'),
        t('item-price.table.columns.max-price'),
        t('item-price.table.columns.price-check'),
      ];
    }
  }, [isMobile, t]);

  const columnsForBook = useMemo(() => {
    if (isMobile) {
      return [
        t('item-price.table.columns.item-name'),
        t('item-price.table.columns.min-price'),
        t('item-price.table.columns.price-check'),
      ];
    } else {
      return [
        t('item-price.table.columns.item-name'),
        t('item-price.table.columns.min-price'),
        t('item-price.table.columns.avg-price'),
        t('item-price.table.columns.max-price'),
        t('item-price.table.columns.price-check'),
      ];
    }
  }, [isMobile, t]);

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
