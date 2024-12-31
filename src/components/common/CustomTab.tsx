import { styled, Tab, Tabs, TabsProps, alpha } from '@mui/material';

export const StyledTabs = styled(Tabs)<TabsProps>(({ theme }) => ({
  '& .MuiTabs-indicator': {
    display: 'none', // 기존 파란 줄 제거
  },
  '& .MuiTabs-flexContainer': {
    gap: theme.spacing(1), // 탭 사이 간격 조정
  },
  display: 'flex',
  alignItems: 'center',
}));

export const StyledTab = styled(Tab)(({ theme }) => ({
  minHeight: '40px',
  padding: '8px 16px',
  borderRadius: theme.shape.borderRadius,
  color: alpha(theme.palette.common.white, 0.7),
  transition: 'all 0.2s ease-in-out',

  '&.Mui-selected': {
    color: theme.palette.common.white,
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
    backdropFilter: 'blur(8px)',
    fontWeight: 600,
  },

  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.common.white,
  },
}));
