import { Box, Typography } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';

const PrivateRoute = ({ children }: React.PropsWithChildren) => {
  const isAdmin = localStorage.getItem('adminYN') === 'Y';

  if (isAdmin) {
    return (
      <>
        {children}
        <Outlet />
      </>
    );
  } else {
    return (
      <Box>
        <Typography>This is only for admin</Typography>
      </Box>
    );
  }
};

export default PrivateRoute;
