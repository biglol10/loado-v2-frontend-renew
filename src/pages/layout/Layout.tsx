import React from 'react';
import { Tab, Tabs, Box, Typography } from '@mui/material';
import { StyledToolbar } from '../home/styles/styles';
import RefineAnimation from '@/assets/images/refine/refineAnimation.gif';
import GoldImage from '@/assets/images/goldImage.png';

const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <Box width={'100%'}>
      <StyledToolbar variant="dense" disableGutters>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
          <Tabs value={'ALL'} centered sx={{ margin: '0 auto' }}>
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
                    <Typography color="white">{`아이템시세`}</Typography>
                  </Box>
                </Box>
              }
              value="ALL"
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
                    <Typography color="white">{`재련시뮬레이션`}</Typography>
                  </Box>
                </Box>
              }
              value="SIMULATION"
              sx={{ padding: '0 25px' }}
            />
          </Tabs>
        </Box>
      </StyledToolbar>

      {children}
    </Box>
  );
};

export default Layout;
