import React from 'react';
import { Skeleton, SkeletonOwnProps, SxProps, Theme } from '@mui/material';

interface IComponentWithSkeletonProps {
  sx?: SxProps<Theme>;
  animation?: SkeletonOwnProps['animation'];
  variant?: SkeletonOwnProps['variant'];
  isLoading?: boolean;
}

const ComponentWithSkeleton = ({
  sx,
  animation,
  variant,
  isLoading,
  children,
}: React.PropsWithChildren<IComponentWithSkeletonProps>) => {
  if (isLoading) {
    return <Skeleton sx={sx} animation={animation} variant={variant} />;
  }

  return <>{children}</>;
};

export default ComponentWithSkeleton;
