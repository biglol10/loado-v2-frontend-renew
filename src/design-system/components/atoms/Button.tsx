import React from 'react';
import { styled } from '@mui/material/styles';
import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import colors from '../../tokens/colors';
import typography from '../../tokens/typography';
import spacing from '../../tokens/spacing';

/**
 * 디자인 시스템 - 버튼 컴포넌트
 *
 * 이 컴포넌트는 애플리케이션 전체에서 일관된 버튼 스타일을 제공합니다.
 * 기존의 MUI Button 컴포넌트를 확장하여 프로젝트의 디자인 시스템에 맞게 커스터마이즈합니다.
 *
 * 이점:
 * 1. 일관성: 전체 애플리케이션에서 동일한 버튼 스타일 사용
 * 2. 재사용성: 표준화된 버튼 컴포넌트 재사용으로 코드 중복 감소
 * 3. 유지보수: 버튼 스타일 변경 시 한 곳만 수정하면 전체 적용
 * 4. 접근성: 접근성 표준을 충족하는 버튼 구현
 * 5. 확장성: 다양한 버튼 변형을 일관된 방식으로 제공
 */

// 추가 속성 정의
export interface ButtonProps extends Omit<MuiButtonProps, 'color'> {
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'default';
  loading?: boolean;
}

// 스타일링된 MUI 버튼
const StyledButton = styled(MuiButton)<ButtonProps>(({
  theme,
  color = 'primary',
  variant,
  size,
  disabled,
  loading,
}) => {
  // 색상 매핑
  const getColorStyles = () => {
    const colorMap = {
      primary: colors.palette.primary,
      secondary: colors.palette.secondary,
      success: colors.palette.success,
      error: colors.palette.error,
      warning: colors.palette.warning,
      info: colors.palette.info,
      default: {
        light: colors.palette.grey[300],
        main: colors.palette.grey[500],
        dark: colors.palette.grey[700],
        contrastText: colors.palette.common.white,
      },
    };

    const colorObj = colorMap[color] || colorMap.primary;

    if (variant === 'contained') {
      return {
        backgroundColor: colorObj.main,
        color: colorObj.contrastText,
        '&:hover': {
          backgroundColor: colorObj.dark,
        },
      };
    } else if (variant === 'outlined') {
      return {
        color: colorObj.main,
        borderColor: colorObj.main,
        '&:hover': {
          borderColor: colorObj.dark,
          backgroundColor: `${colorObj.light}10`, // 10% 투명도
        },
      };
    } else {
      return {
        color: colorObj.main,
        '&:hover': {
          backgroundColor: `${colorObj.light}10`, // 10% 투명도
        },
      };
    }
  };

  // 크기 매핑
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          ...typography.variants.button,
          fontSize: typography.fontSize.xs,
          padding: `${spacing.space[1]} ${spacing.space[3]}`,
        };
      case 'large':
        return {
          ...typography.variants.button,
          padding: `${spacing.space[3]} ${spacing.space[6]}`,
        };
      default: // 'medium'
        return {
          ...typography.variants.button,
          padding: `${spacing.space[2]} ${spacing.space[4]}`,
        };
    }
  };

  return {
    ...getColorStyles(),
    ...getSizeStyles(),
    textTransform: 'none',
    boxShadow: variant === 'contained' ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
    transition: 'all 0.2s ease-in-out',
    position: 'relative',

    // Disabled 상태
    '&.Mui-disabled': {
      backgroundColor:
        disabled && variant === 'contained' ? colors.semantic.background.disabled : undefined,
      color: colors.semantic.text.disabled,
    },

    // 로딩 상태
    ...(loading && {
      '& .MuiButton-startIcon, & .MuiButton-endIcon': {
        visibility: 'hidden',
      },
      color: 'transparent',
      '&::after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '1rem',
        height: '1rem',
        marginTop: '-0.5rem',
        marginLeft: '-0.5rem',
        borderRadius: '50%',
        border: '2px solid currentColor',
        borderTopColor: 'transparent',
        animation: 'button-loading-spinner 0.8s linear infinite',
      },
      '@keyframes button-loading-spinner': {
        from: {
          transform: 'rotate(0turn)',
        },
        to: {
          transform: 'rotate(1turn)',
        },
      },
    }),
  };
});

/**
 * 디자인 시스템의 버튼 컴포넌트
 */
const Button: React.FC<ButtonProps> = ({ children, loading, disabled, ...props }) => {
  return (
    <StyledButton disabled={disabled || loading} loading={loading} {...props}>
      {children}
    </StyledButton>
  );
};

export default Button;
