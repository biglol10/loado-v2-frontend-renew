import { useRef, useEffect } from 'react';
import { trackMetric } from '../reporter';
import { isDev } from '../../environment';

/**
 * 컴포넌트 렌더링 성능 측정 훅
 *
 * 이 훅은 React 컴포넌트의 렌더링 성능을 실시간으로 측정합니다.
 *
 * 측정하는 정보:
 * - 렌더링 횟수
 * - 렌더링 간 경과 시간
 * - 렌더링 기간
 * - 마운트 기간
 *
 * 이점:
 * 1. 컴포넌트 최적화: 불필요한 리렌더링 감지
 * 2. 성능 병목 식별: 느린 렌더링이 발생하는 컴포넌트 식별
 * 3. 메모이제이션 효과 검증: React.memo, useMemo, useCallback의 효과 확인
 * 4. 렌더링 패턴 분석: 컴포넌트 렌더링 빈도 및 패턴 이해
 *
 * @param componentName - 로깅 시 표시할 컴포넌트 이름
 * @returns 렌더링 측정 지표 (렌더링 횟수, 렌더링 기간)
 */

// 컴포넌트 렌더링 성능 측정 훅 옵션
type RenderMetricsOptions = {
  componentName: string; // 측정 대상 컴포넌트 이름
  trackMounts?: boolean; // 마운트 시간 측정 여부
  trackUpdates?: boolean; // 업데이트 시간 측정 여부
  logToConsole?: boolean; // 콘솔에 로깅 여부
};

/**
 * 컴포넌트 렌더링 성능을 측정하는 React 훅
 *
 * @param options - 측정 옵션
 */
export function useRenderMetrics({
  componentName,
  trackMounts = true,
  trackUpdates = true,
  logToConsole = false,
}: RenderMetricsOptions) {
  // 렌더링 타임스탬프 저장용 ref
  const renderStartTime = useRef<number>(0);
  // 컴포넌트 마운트 여부 추적
  const isMounted = useRef<boolean>(false);
  // 렌더링 횟수 추적
  const renderCount = useRef(0);
  // 마지막 렌더링 시간 추적
  const lastRenderTime = useRef(performance.now());
  // 마지막 렌더링 기간 추적
  const renderDurationRef = useRef(0);

  // 현재 개발 환경 여부
  const isDevEnvironment = isDev();

  useEffect(() => {
    // 현재 렌더링 시작 시간
    const startTime = performance.now();
    // 렌더링 횟수 증가
    renderCount.current += 1;

    // 이전 렌더링과의 시간 간격 계산
    const renderDuration = startTime - lastRenderTime.current;
    renderDurationRef.current = renderDuration;

    // 개발 환경에서만 렌더링 정보 로깅
    if (isDevEnvironment) {
      console.log(
        `[${componentName}] 렌더링 #${renderCount.current}, 마지막 렌더링 후 경과: ${renderDuration.toFixed(2)}ms`
      );
    }

    // 다음 계산을 위해 현재 시간 저장
    lastRenderTime.current = startTime;

    // 컴포넌트 언마운트 시 실행
    return () => {
      const unmountTime = performance.now();
      // 마운트 지속 시간 계산
      const mountDuration = unmountTime - startTime;

      // 개발 환경에서만 언마운트 정보 로깅
      if (isDevEnvironment) {
        console.log(`[${componentName}] 마운트 기간: ${mountDuration.toFixed(2)}ms`);
      }
    };
  }); // 의존성 배열 없음 - 매 렌더링마다 실행

  // 측정 지표 반환 (프로덕션에서도 메트릭 자체는 계산하여 반환)
  return {
    renderCount: renderCount.current,
    renderDuration: renderDurationRef.current,
  };
}
