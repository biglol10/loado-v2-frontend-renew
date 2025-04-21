/**
 * 디자인 시스템 - 색상 토큰
 *
 * 이 파일은 애플리케이션 전체에서 사용되는 모든 색상 값을 정의합니다.
 *
 * 이점:
 * 1. 일관성: 전체 애플리케이션에서 동일한 색상 팔레트 사용 보장
 * 2. 유지보수: 색상 변경 시 한 곳만 수정하면 전체 적용
 * 3. 테마 지원: 라이트/다크 모드 등 테마 전환 용이
 * 4. 접근성: 접근성 표준을 충족하는 대비율 보장 가능
 * 5. 문서화: 색상의 의미와 용도를 명확히 정의하여 개발자 간 이해 일치
 */

// 기본 색상 팔레트
export const palette = {
  // 주요 브랜드 색상
  primary: {
    light: '#6592fd',
    main: '#3366ff',
    dark: '#0039cb',
    contrastText: '#ffffff',
  },

  // 보조 색상
  secondary: {
    light: '#ff94c2',
    main: '#ff6392',
    dark: '#c83164',
    contrastText: '#ffffff',
  },

  // 의미적 상태 색상
  success: {
    light: '#7bc67e',
    main: '#4caf50',
    dark: '#3b8a3e',
    contrastText: '#ffffff',
  },

  warning: {
    light: '#ffb74d',
    main: '#ff9800',
    dark: '#c77700',
    contrastText: '#000000',
  },

  error: {
    light: '#ef5350',
    main: '#f44336',
    dark: '#c62828',
    contrastText: '#ffffff',
  },

  info: {
    light: '#64b5f6',
    main: '#2196f3',
    dark: '#1976d2',
    contrastText: '#ffffff',
  },

  // 중립 색상
  grey: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  // 기타 기본 색상
  common: {
    black: '#000000',
    white: '#ffffff',
    transparent: 'transparent',
  },
};

// 의미적 색상 정의 (용도별)
export const semantic = {
  // 배경 색상
  background: {
    default: palette.common.white,
    paper: palette.grey[50],
    disabled: palette.grey[200],
  },

  // 텍스트 색상
  text: {
    primary: palette.grey[900],
    secondary: palette.grey[700],
    disabled: palette.grey[500],
    hint: palette.grey[500],
  },

  // 액션 요소 색상
  action: {
    active: palette.grey[900],
    hover: palette.grey[200],
    selected: palette.grey[300],
    disabled: palette.grey[300],
    disabledBackground: palette.grey[200],
  },

  // 구분선 색상
  divider: palette.grey[300],
};

// 결합된 색상 시스템 export
const colors = {
  palette,
  semantic,
};

export default colors;
