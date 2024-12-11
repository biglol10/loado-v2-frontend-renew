import { ComponentType, lazy, Suspense } from 'react';
import FallbackLoader from './FallbackLoader';

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
