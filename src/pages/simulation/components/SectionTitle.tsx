import { Box, Typography, styled, alpha } from '@mui/material';

export const TitleWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  gap: theme.spacing(2),
  '&::before, &::after': {
    content: '""',
    height: 2,
    flex: 1,
    background: `linear-gradient(90deg,
            ${alpha(theme.palette.primary.main, 0)} 0%,
            ${alpha(theme.palette.primary.main, 0.5)} 50%,
            ${alpha(theme.palette.primary.main, 0)} 100%
        )`,
  },
}));

export const TitleWrapperMulti = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  '&::before, &::after': {
    content: '""',
    height: 2,
    flex: 1,
    background: `linear-gradient(90deg,
            ${alpha(theme.palette.primary.main, 0)} 0%,
            ${alpha(theme.palette.primary.main, 0.5)} 50%,
            ${alpha(theme.palette.primary.main, 0)} 100%
        )`,
  },
}));

export const StyledTitle = styled(Typography)<{ active?: boolean }>(({ theme, active = true }) => ({
  color: active ? theme.palette.primary.main : 'white',
  fontWeight: 600,
  padding: 5,
  borderRadius: theme.shape.borderRadius,
  background: alpha(theme.palette.primary.main, 0.1),
  backdropFilter: 'blur(8px)',
  boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.2)}`,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
}));

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <TitleWrapper>
    <StyledTitle>{children}</StyledTitle>
  </TitleWrapper>
);
