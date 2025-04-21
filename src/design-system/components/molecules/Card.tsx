import React from 'react';
import { styled } from '@mui/material/styles';
import MuiCard from '@mui/material/Card';
import MuiCardHeader from '@mui/material/CardHeader';
import MuiCardContent from '@mui/material/CardContent';
import MuiCardActions from '@mui/material/CardActions';
import colors from '../../tokens/colors';
import spacing from '../../tokens/spacing';
import typography from '../../tokens/typography';

/**
 * 디자인 시스템 - 카드 컴포넌트
 *
 * 이 컴포넌트는 애플리케이션 전체에서 일관된 카드 컴포넌트를 제공합니다.
 * 헤더, 콘텐츠, 액션 영역을 포함한 완전한 카드 구조를 제공합니다.
 *
 * 이점:
 * 1. 일관성: 전체 애플리케이션에서 동일한 카드 디자인 사용
 * 2. 재사용성: 다양한 컨텐츠에 적용 가능한 일관된 컨테이너 제공
 * 3. 커스터마이징: 다양한 변형 옵션으로 유연한 사용 지원
 * 4. 유지보수: 카드 디자인 변경 시 한 곳만 수정하면 전체 적용
 * 5. 명확한 구조: 콘텐츠를 논리적으로 그룹화하는 일관된 구조 제공
 */

// 스타일링된 MUI Card 컴포넌트
const StyledCard = styled(MuiCard, {
  shouldForwardProp: (prop) => prop !== 'elevation' && prop !== 'variant',
})<{
  elevation?: number;
  variant?: 'outlined' | 'elevation';
}>(({ theme, elevation = 1, variant = 'elevation' }) => ({
  borderRadius: '8px',
  overflow: 'hidden',
  transition: 'all 0.3s ease-in-out',
  backgroundColor: colors.semantic.background.paper,

  ...(variant === 'outlined' && {
    border: `1px solid ${colors.semantic.divider}`,
    boxShadow: 'none',
  }),

  ...(variant === 'elevation' && {
    boxShadow: `0 ${elevation}px ${elevation * 3}px rgba(0, 0, 0, 0.1)`,
    '&:hover': {
      boxShadow: `0 ${elevation + 2}px ${(elevation + 2) * 3}px rgba(0, 0, 0, 0.15)`,
    },
  }),
}));

// 스타일링된 MUI CardHeader 컴포넌트
const StyledCardHeader = styled(MuiCardHeader)(({ theme }) => ({
  padding: spacing.semantic.component.lg,
  '& .MuiCardHeader-title': {
    ...typography.variants.h5,
    color: colors.semantic.text.primary,
  },
  '& .MuiCardHeader-subheader': {
    ...typography.variants.body2,
    color: colors.semantic.text.secondary,
  },
}));

// 스타일링된 MUI CardContent 컴포넌트
const StyledCardContent = styled(MuiCardContent)(({ theme }) => ({
  padding: spacing.semantic.component.lg,
  '&:last-child': {
    paddingBottom: spacing.semantic.component.lg,
  },
}));

// 스타일링된 MUI CardActions 컴포넌트
const StyledCardActions = styled(MuiCardActions)(({ theme }) => ({
  padding: spacing.semantic.component.md,
  justifyContent: 'flex-end',
}));

interface CardProps {
  title?: React.ReactNode;
  subheader?: React.ReactNode;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  elevation?: number;
  variant?: 'outlined' | 'elevation';
  className?: string;
}

/**
 * 디자인 시스템의 카드 컴포넌트
 *
 * @param title - 카드 제목
 * @param subheader - 카드 부제목
 * @param headerAction - 헤더에 표시할 액션
 * @param children - 카드 본문 콘텐츠
 * @param actions - 카드 하단 액션 영역
 * @param elevation - 카드 그림자 강도 (1-24)
 * @param variant - 카드 스타일 ('outlined' | 'elevation')
 * @param className - 추가 CSS 클래스
 */
const Card: React.FC<CardProps> = ({
  title,
  subheader,
  headerAction,
  children,
  actions,
  elevation = 1,
  variant = 'elevation',
  className,
}) => {
  return (
    <StyledCard elevation={elevation} variant={variant} className={className}>
      {(title || subheader || headerAction) && (
        <StyledCardHeader title={title} subheader={subheader} action={headerAction} />
      )}
      <StyledCardContent>{children}</StyledCardContent>
      {actions && <StyledCardActions>{actions}</StyledCardActions>}
    </StyledCard>
  );
};

export default Card;
