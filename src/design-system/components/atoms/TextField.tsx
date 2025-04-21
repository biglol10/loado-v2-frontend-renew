import React from 'react';
import { styled } from '@mui/material/styles';
import MuiTextField, { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';
import colors from '../../tokens/colors';
import typography from '../../tokens/typography';
import spacing from '../../tokens/spacing';

/**
 * 디자인 시스템 - 텍스트 필드 컴포넌트
 *
 * 이 컴포넌트는 애플리케이션 전체에서 일관된 입력 필드 스타일을 제공합니다.
 * 기존의 MUI TextField 컴포넌트를 확장하여 프로젝트의 디자인 시스템에 맞게 커스터마이즈합니다.
 *
 * 이점:
 * 1. 일관성: 전체 애플리케이션에서 동일한 입력 필드 스타일 사용
 * 2. 재사용성: 표준화된 입력 필드 컴포넌트 재사용으로 코드 중복 감소
 * 3. 유지보수: 입력 필드 스타일 변경 시 한 곳만 수정하면 전체 적용
 * 4. 접근성: 접근성 표준을 충족하는 입력 필드 구현
 * 5. 사용성: 오류 상태, 도움말 텍스트 등 일관된 사용자 피드백 제공
 */

// 확장 속성 정의
export interface TextFieldProps extends MuiTextFieldProps {
  isValid?: boolean;
}

// 스타일링된 MUI TextField
const StyledTextField = styled(MuiTextField)<TextFieldProps>(
  ({ theme, error, isValid, disabled }) => ({
    margin: spacing.space[2],

    // 레이블 스타일
    '& .MuiInputLabel-root': {
      ...typography.variants.body2,
      color: colors.semantic.text.secondary,

      '&.Mui-focused': {
        color: error
          ? colors.palette.error.main
          : isValid
            ? colors.palette.success.main
            : colors.palette.primary.main,
      },

      '&.Mui-error': {
        color: colors.palette.error.main,
      },

      '&.Mui-disabled': {
        color: colors.semantic.text.disabled,
      },
    },

    // 입력 필드 스타일
    '& .MuiInputBase-root': {
      ...typography.variants.body1,
      backgroundColor: disabled
        ? colors.semantic.background.disabled
        : colors.semantic.background.paper,
      borderRadius: '4px',
      transition: 'all 0.2s ease-in-out',

      // 호버 상태
      '&:hover': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor:
            !disabled &&
            (error
              ? colors.palette.error.main
              : isValid
                ? colors.palette.success.main
                : colors.palette.primary.main),
        },
      },

      // 포커스 상태
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderWidth: '2px',
        borderColor: error
          ? colors.palette.error.main
          : isValid
            ? colors.palette.success.main
            : colors.palette.primary.main,
      },

      // 에러 상태
      '&.Mui-error .MuiOutlinedInput-notchedOutline': {
        borderColor: colors.palette.error.main,
      },

      // 비활성화 상태
      '&.Mui-disabled': {
        backgroundColor: colors.semantic.background.disabled,

        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: colors.semantic.text.disabled,
        },
      },
    },

    // 헬퍼 텍스트 스타일
    '& .MuiFormHelperText-root': {
      ...typography.variants.caption,
      margin: `${spacing.space[1]} 0 0 ${spacing.space[2]}`,

      '&.Mui-error': {
        color: colors.palette.error.main,
      },
    },

    // 유효성 상태 표시
    ...(isValid && {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: colors.palette.success.main,
      },
      '& .MuiFormHelperText-root': {
        color: colors.palette.success.main,
      },
    }),
  })
);

/**
 * 디자인 시스템의 텍스트 필드 컴포넌트
 */
const TextField: React.FC<TextFieldProps> = ({ isValid, ...props }) => {
  return <StyledTextField isValid={isValid} {...props} />;
};

export default TextField;
