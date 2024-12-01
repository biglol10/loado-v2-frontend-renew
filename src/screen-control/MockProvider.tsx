import React, { useEffect, useState } from 'react';
import { worker } from '@/mocks/browser';

interface IMockProviderProps {
  enable?: boolean;
}

const MockProvider: React.FC<React.PropsWithChildren<IMockProviderProps>> = ({
  enable,
  children,
}) => {
  const [_, setStart] = useState(false);

  useEffect(() => {
    if (enable) {
      worker
        .start({
          onUnhandledRequest: 'bypass',
        })
        .then(() => {
          setStart(true);
        })
        .catch((error) => {
          console.error('error in mock provider', error);
        });
    }
  }, [enable]);

  return <>{children}</>;
};

export default MockProvider;
