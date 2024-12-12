import React, { useState } from 'react';
import { Tab, Tabs, Box, Typography } from '@mui/material';
import RefineAnimation from '@/assets/images/refine/refineAnimation.gif';
import GoldImage from '@/assets/images/goldImage.png';
import itemPriceStore from '@/store/item-price/itemPriceStore';
import { useTranslation } from 'react-i18next';
import { StyledToolbar } from '@/pages/home/styles/styles';
import { Outlet, useNavigate } from 'react-router-dom';

type TCurrentPage = 'ITEM_PRICE' | 'SIMULATION';

const AppLayout = ({ children }: React.PropsWithChildren) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setSelectedItemIdToView } = itemPriceStore();
  const [currentPage, setCurrentPage] = useState<TCurrentPage>('ITEM_PRICE');

  const handleTabChange = (_: React.SyntheticEvent, value: TCurrentPage) => {
    setSelectedItemIdToView(undefined);
    setCurrentPage(value);
    if (value === 'ITEM_PRICE') navigate('/item-price');
    if (value === 'SIMULATION') navigate('/simulation');
  };

  return (
    <Box width={'100%'}>
      <StyledToolbar variant="dense" disableGutters>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
          <Tabs value={currentPage} centered sx={{ margin: '0 auto' }} onChange={handleTabChange}>
            <Tab
              label={
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
                  <Box
                    component={'img'}
                    sx={{
                      height: '40px',
                      width: '40px',
                      borderRadius: '10%',
                      marginRight: '10px',
                    }}
                    src={GoldImage}
                  />
                  <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                    <Typography color="white">{t('layout.itemPrice')}</Typography>
                  </Box>
                </Box>
              }
              value="ITEM_PRICE"
              sx={{ padding: '0 25px' }}
            />
            <Tab
              label={
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
                  <Box
                    component={'img'}
                    sx={{ height: '40px', width: '40px', borderRadius: '10%', marginRight: '10px' }}
                    src={RefineAnimation}
                  />
                  <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                    <Typography color="white">{t('layout.simulation')}</Typography>
                  </Box>
                </Box>
              }
              value="SIMULATION"
              sx={{ padding: '0 25px' }}
            />
          </Tabs>
        </Box>
      </StyledToolbar>

      <Outlet />
    </Box>
  );
};

export default AppLayout;
