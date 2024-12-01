import { Box } from '@mui/material';
import { useLayoutEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';

const ScreenLog = () => {
  const location = useLocation();

  useLayoutEffect(() => {
    console.log('location.pathname is ', location.pathname);
  }, [location]);

  return (
    <>
      <Box
        sx={{
          bgcolor: 'background.default',
          color: 'text.primary',
        }}
        height={'100vh'}
        width={'100vw'}
      >
        <Outlet />
      </Box>
    </>
  );
};

export default ScreenLog;
