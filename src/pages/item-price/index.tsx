import { Tab, Tabs, Grid, Paper, Box } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import Home from '../home';
import { useEffect, useMemo, useState } from 'react';
import * as ComponentTypes from '@/apis/itemPrice/types';
import userStore from '@/store/user/userStore';
import { isEmpty, orderBy } from 'lodash';
import { useItemPriceQuery } from '@/apis/itemPrice/useItemPriceQuery';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import DenseTable from './DenseTable';
import ComponentWithSkeleton from '../../components/atomic/ComponentWithSkeleton';
import DensePriceTable from './DensePriceTable';

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

const ItemPricePage = () => {
  const navigate = useNavigate();
  const { setIsMobile } = userStore();

  const [activeTab, setActiveTab] = useState<ComponentTypes.TActiveTabType>('ALL');
  const [refinement, setRefinement] = useState<ComponentTypes.IItemData[]>([]);
  const [refinementAdditional, setRefinementAdditional] = useState<ComponentTypes.IItemData[]>([]);
  const [etc, setEtc] = useState<ComponentTypes.IItemData[]>([]);
  const [esder, setEsder] = useState<ComponentTypes.IItemData[]>([]);
  const [engravings, setEngravings] = useState<ComponentTypes.IItemData[]>([]);
  const [characterEngravings, setCharacterEngravings] = useState<ComponentTypes.IItemData[]>([]);
  const [jewelry, setJewelry] = useState<ComponentTypes.IItemData[]>([]);

  const [tabValue, setTabValue] = useState('전체');

  const { isMobile } = userStore();

  const returnDataByStringArray = (data: ComponentTypes.IItemData[], arr: string[]) => {
    const orderedData = orderBy(data, (item) => {
      const index = arr.indexOf(item.itemName);

      return index !== -1 ? index : Math.max();
    });

    return orderedData;
  };

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
            case 44420:
              setCharacterEngravings(dataToUse);
              break;
            case 50010:
              setRefinement(dataToUse);
              break;
            case 50020:
              setRefinementAdditional(dataToUse);
              break;
            case 51000:
              setEtc(dataToUse);
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
      return ['아이템명', '최소가격', '시세조회'];
    } else {
      return ['아이템명', '최소가격', '평균가격', '최대가격', '시세조회'];
    }
  }, [isMobile]);

  const columnsForBook = useMemo(() => {
    if (isMobile) {
      return ['아이템명', '최소가격', '시세조회'];
    } else {
      return ['아이템명', '최소가격', '평균가격', '최대가격', '시세조회'];
    }
  }, [isMobile]);

  const handleTabChange = (_: React.SyntheticEvent, value: any) => {
    console.log('value is ', value);
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="전체" value="전체" />
        <Tab label="각인서" value="각인서" />
        <Tab label="재련재료" value="재련재료" />
        <Tab label="에스더/보석" value="에스더/보석" />
      </Tabs>

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
                    <DensePriceTable title="재련 재료" rows={refinement} />
                  </ComponentWithSkeleton>
                </Grid>
                <Grid item xs={12}>
                  <ComponentWithSkeleton
                    sx={{ height: 250 }}
                    animation="wave"
                    variant="rectangular"
                    isLoading={isLoading}
                  >
                    <DensePriceTable title="재련 추가 재료" rows={refinementAdditional} />
                  </ComponentWithSkeleton>
                </Grid>
                <Grid item xs={12}>
                  <ComponentWithSkeleton
                    sx={{ height: 250 }}
                    animation="wave"
                    variant="rectangular"
                    isLoading={isLoading}
                  >
                    <DensePriceTable title="에스더의 기운 / 보석" rows={[...esder, ...jewelry]} />
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
                    <DensePriceTable title="각인서" rows={engravings} type="book" />
                  </ComponentWithSkeleton>
                </Grid>
                <Grid item xs={12}>
                  <ComponentWithSkeleton
                    sx={{ height: 250 }}
                    animation="wave"
                    variant="rectangular"
                    isLoading={isLoading}
                  >
                    <DensePriceTable title="직업 각인서" rows={characterEngravings} type="book" />
                  </ComponentWithSkeleton>
                </Grid>
              </Grid>
            </Item>
          </Grid>
        </Grid>
      </Box>
      <Outlet />
    </Box>
  );
};

export default ItemPricePage;
