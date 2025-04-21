/**
 * 디자인 시스템 통합 모듈
 *
 * 이 파일은 디자인 시스템의 모든 구성 요소를 내보내는 중앙 집중식 진입점입니다.
 *
 * 이점:
 * 1. 간소화된 가져오기: 모든 디자인 시스템 요소를 한 곳에서 가져오기 가능
 * 2. 구성 요소 검색 용이: 사용 가능한 모든 디자인 시스템 구성 요소를 한눈에 확인 가능
 * 3. 명시적 API 경계: 디자인 시스템의 공개 API를 명확하게 정의
 * 4. 내부 구현 은닉: 내부 구현 세부 사항을 숨기고 안정적인 API만 노출
 * 5. 버전 관리: 디자인 시스템 변경 시 여기서 관리하여 추적 용이
 */

// 디자인 토큰 내보내기
export { default as theme, lightTheme, darkTheme, type Theme } from './tokens';
export { default as colors } from './tokens/colors';
export { default as typography } from './tokens/typography';
export { default as spacing } from './tokens/spacing';

// 아토믹 컴포넌트 내보내기
export { default as Button } from './components/atoms/Button';
export type { ButtonProps } from './components/atoms/Button';
export { default as TextField } from './components/atoms/TextField';
export type { TextFieldProps } from './components/atoms/TextField';

// 분자 컴포넌트 내보내기
export { default as Card } from './components/molecules/Card';
export { default as FormField } from './components/molecules/FormField';

// 유기체 컴포넌트 내보내기
export { default as DataTable } from './components/organisms/DataTable';
export type { HeadCell } from './components/organisms/DataTable';
