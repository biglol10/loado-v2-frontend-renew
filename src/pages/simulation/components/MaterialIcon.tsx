import { Box, styled } from '@mui/material';

interface MaterialIconProps {
  name: string;
  size?: number;
  src: string;
}

const IconWrapper = styled(Box)<{ size: number }>(({ size }) => ({
  width: size,
  height: size,
  borderRadius: '50%',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}));

const MaterialIcon = ({ name, src, size = 32 }: MaterialIconProps) => {
  return (
    <IconWrapper size={size}>
      <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </IconWrapper>
  );
};

export default MaterialIcon;
