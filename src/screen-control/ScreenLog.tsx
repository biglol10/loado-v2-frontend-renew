import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

const ScreenLog = () => {
  return (
    <>
      <Box
        sx={{
          bgcolor: 'background.default',
          color: 'text.primary',
        }}
        height={'100vh'}
      >
        <Outlet />
      </Box>
    </>
  );
};

export default ScreenLog;
