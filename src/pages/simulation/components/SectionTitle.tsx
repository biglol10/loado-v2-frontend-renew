import { Box, Typography, styled, alpha } from '@mui/material';

const TitleWrapper = styled(Box)(({ theme }) => ({
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

const StyledTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 600,
  padding: theme.spacing(1, 3),
  borderRadius: theme.shape.borderRadius,
  background: alpha(theme.palette.primary.main, 0.1),
  backdropFilter: 'blur(8px)',
  boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.2)}`,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
}));

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <TitleWrapper>
    <StyledTitle variant="h6">{children}</StyledTitle>
  </TitleWrapper>
);
