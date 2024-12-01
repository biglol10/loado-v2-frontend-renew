import { ComponentType, lazy, Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';

const FallbackLoader = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}
  >
    <CircularProgress />
  </Box>
);

const lazyload = (componentImport: () => Promise<{ default: ComponentType<any> }>) => {
  try {
    const Component = lazy(componentImport);

    return (
      <Suspense fallback={<FallbackLoader />}>
        <Component />
      </Suspense>
    );
  } catch (error) {
    console.log('error in lazyload ', lazyload);
    throw error;
  }
};

export default lazyload;
