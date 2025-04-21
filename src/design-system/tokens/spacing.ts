/**
 * 디자인 시스템 - 간격 토큰
 *
 * 이 파일은 애플리케이션 전체에서 사용되는 모든 간격 값을 정의합니다.
 *
 * 이점:
 * 1. 일관성: 전체 애플리케이션에서 동일한 간격 체계 사용
 * 2. 유지보수: 간격 변경 시 한 곳만 수정하면 전체 적용
 * 3. 반응형: 화면 크기에 따른 간격 조정 용이
 * 4. 레이아웃 정렬: 일관된 그리드 시스템과 레이아웃 구성 가능
 * 5. 시각적 리듬: 애플리케이션 전체에 일관된 시각적 리듬 부여
 */

// 기본 간격 단위 (rem 기준, 1rem = 16px 가정)
export const space = {
  0: '0',
  0.5: '0.125rem', // 2px
  1: '0.25rem', // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem', // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem', // 12px
  3.5: '0.875rem', // 14px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  7: '1.75rem', // 28px
  8: '2rem', // 32px
  9: '2.25rem', // 36px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  14: '3.5rem', // 56px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  28: '7rem', // 112px
  32: '8rem', // 128px
  36: '9rem', // 144px
  40: '10rem', // 160px
  44: '11rem', // 176px
  48: '12rem', // 192px
  52: '13rem', // 208px
  56: '14rem', // 224px
  60: '15rem', // 240px
  64: '16rem', // 256px
  72: '18rem', // 288px
  80: '20rem', // 320px
  96: '24rem', // 384px
};

// 의미적 간격 정의
export const semantic = {
  // 컴포넌트 내부 간격
  component: {
    xs: space[1], // 4px
    sm: space[2], // 8px
    md: space[3], // 12px
    lg: space[4], // 16px
    xl: space[6], // 24px
  },

  // 컴포넌트 간 간격
  layout: {
    xs: space[2], // 8px
    sm: space[4], // 16px
    md: space[6], // 24px
    lg: space[8], // 32px
    xl: space[12], // 48px
    xxl: space[16], // 64px
  },

  // 섹션 간 간격
  section: {
    sm: space[8], // 32px
    md: space[12], // 48px
    lg: space[16], // 64px
    xl: space[24], // 96px
  },

  // 컨테이너 패딩
  container: {
    sm: space[4], // 16px
    md: space[6], // 24px
    lg: space[8], // 32px
  },
};

// 결합된 간격 시스템 export
const spacing = {
  space,
  semantic,
};

export default spacing;
