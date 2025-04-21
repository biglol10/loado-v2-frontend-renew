/**
 * 디자인 시스템 - 토큰 통합 모듈
 *
 * 이 파일은 모든 디자인 토큰을 하나의 객체로 통합하여 내보냅니다.
 *
 * 이점:
 * 1. 통합된 접근: 모든 디자인 토큰에 대한 단일 진입점 제공
 * 2. 일관성: 전체 애플리케이션에서 동일한 토큰 사용 보장
 * 3. 테마 전환: 라이트/다크 모드 등 테마 전환 지원 기반
 * 4. 버전 관리: 디자인 시스템 변경 시 중앙 집중식 관리 가능
 */

import colors from './colors';
import typography from './typography';
import spacing from './spacing';

// 테마 타입 정의
export type Theme = {
  colors: typeof colors;
  typography: typeof typography;
  spacing: typeof spacing;
};

// 기본 테마 (라이트 모드)
export const lightTheme: Theme = {
  colors,
  typography,
  spacing,
};

// 다크 모드 테마 (향후 구현을 위한 구조)
export const darkTheme: Theme = {
  // 다크 모드용 색상 오버라이드
  colors: {
    ...colors,
    semantic: {
      ...colors.semantic,
      background: {
        default: colors.palette.grey[900],
        paper: colors.palette.grey[800],
        disabled: colors.palette.grey[700],
      },
      text: {
        primary: colors.palette.common.white,
        secondary: colors.palette.grey[300],
        disabled: colors.palette.grey[500],
        hint: colors.palette.grey[500],
      },
      divider: colors.palette.grey[700],
    },
  },
  typography,
  spacing,
};

// 기본 테마로 라이트 테마 내보내기
export default lightTheme;
