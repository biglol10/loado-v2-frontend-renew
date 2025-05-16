import { useEffect, useRef, useState } from 'react';
import { imageSrcCollection } from '../const/imageSrcCollection';
import useIntersectionObserver from '@/utils/hooks/useIntersectionObserver';
import { Avatar, Skeleton } from '@mui/material';

const ItemAvatar = ({
  type,
  itemId,
  itemName,
}: {
  type?: 'book';
  itemId: keyof typeof imageSrcCollection;
  itemName: string;
}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  const { observe, unobserve } = useIntersectionObserver(
    () => {
      setIsIntersecting(true);
    },
    {
      rootMargin: '0px',
      threshold: 0.1,
    }
  );

  const skeletonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = skeletonRef.current;
    if (element) {
      observe(element);
      return () => {
        unobserve(element);
      };
    }
  }, [observe, unobserve]);

  if (!isIntersecting) {
    return <Skeleton ref={skeletonRef} variant="circular" width={40} height={40} />;
  }

  return (
    <Avatar
      src={
        type !== 'book'
          ? imageSrcCollection[itemId]
          : imageSrcCollection[itemName.includes('(유물)') ? 'relicBook' : 'book']
      }
      alt={itemName}
    />
  );
};

export default ItemAvatar;
