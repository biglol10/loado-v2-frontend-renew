import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, FormControl, FormHelperText, FormLabel } from '@mui/material';
import Typography from '@mui/material/Typography';
import colors from '../../tokens/colors';
import spacing from '../../tokens/spacing';

/**
 * 디자인 시스템 - 폼 필드 컴포넌트
 *
 * 이 컴포넌트는 애플리케이션 전체에서 일관된 폼 필드 레이아웃을 제공합니다.
 * 레이블, 입력 요소, 헬퍼 텍스트, 에러 메시지를 포함한 완전한 폼 필드 구조를 제공합니다.
 *
 * 이점:
 * 1. 일관성: 전체 애플리케이션에서 동일한 폼 필드 구조 사용
 * 2. 재사용성: 다양한 입력 컴포넌트와 함께 사용 가능한 일관된 래퍼 제공
 * 3. 접근성: 레이블과 입력 요소의 연결, 오류 메시지 처리 등 접근성 최적화
 * 4. 유연성: 다양한 입력 타입과 레이아웃에 대응 가능한 유연한 구조
 * 5. 유지보수: 폼 필드 구조 변경 시 한 곳만 수정하면 전체 적용
 */

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  margin: `${spacing.space[3]} 0`,
  width: '100%',
}));

const StyledLabel = styled(FormLabel)(({ theme }) => ({
  marginBottom: spacing.space[2],
  fontWeight: 'bold',
  color: colors.semantic.text.primary,

  '&.Mui-focused': {
    color: colors.palette.primary.main,
  },

  '&.Mui-error': {
    color: colors.palette.error.main,
  },

  '&.Mui-disabled': {
    color: colors.semantic.text.disabled,
  },
}));

const StyledHelperText = styled(FormHelperText)(({ theme }) => ({
  margin: `${spacing.space[1]} 0 0`,

  '&.Mui-error': {
    color: colors.palette.error.main,
  },
}));

interface FormFieldProps {
  id: string;
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * 디자인 시스템의 폼 필드 컴포넌트
 *
 * @param id - 필드 식별자 (레이블과 입력 요소 연결용)
 * @param label - 필드 레이블
 * @param helperText - 도움말 텍스트
 * @param error - 오류 상태
 * @param errorMessage - 오류 메시지
 * @param required - 필수 필드 여부
 * @param disabled - 비활성화 상태
 * @param children - 입력 컴포넌트 (TextField, Select 등)
 * @param fullWidth - 전체 너비 사용 여부
 */
const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  helperText,
  error = false,
  errorMessage,
  required = false,
  disabled = false,
  children,
  fullWidth = true,
}) => {
  return (
    <StyledFormControl fullWidth={fullWidth} error={error} disabled={disabled}>
      {label && (
        <StyledLabel htmlFor={id} required={required} error={error}>
          {label}
        </StyledLabel>
      )}

      {/* 입력 컴포넌트 */}
      <Box>
        {React.cloneElement(children as React.ReactElement, {
          id,
          error,
          disabled,
          required,
          'aria-describedby': `${id}-helper-text`,
        })}
      </Box>

      {/* 도움말 또는 오류 메시지 */}
      {(helperText || (error && errorMessage)) && (
        <StyledHelperText id={`${id}-helper-text`} error={error}>
          {error && errorMessage ? errorMessage : helperText}
        </StyledHelperText>
      )}
    </StyledFormControl>
  );
};

export default FormField;
