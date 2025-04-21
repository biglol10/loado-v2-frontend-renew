import { useEffect, useRef, useCallback } from 'react';
import { trackMetric } from '../reporter';
import { isDev } from '../../environment';

/**
 * 사용자 인터랙션 지연 측정 훅
 *
 * 이 훅은 사용자 인터랙션(클릭, 제출 등)의 응답 시간을 측정합니다.
 *
 * 측정하는 정보:
 * - 인터랙션 시작 시간
 * - 인터랙션 완료 시간
 * - 인터랙션 처리 기간
 * - 느린 인터랙션 감지
 *
 * 이점:
 * 1. 사용자 경험 개선: 느린 인터랙션 감지 및 최적화
 * 2. 성능 병목 식별: 어떤 인터랙션이 지연되는지 파악
 * 3. 사용자 관점 성능 측정: 사용자가 직접 체감하는 성능 측정
 * 4. 인터랙션 패턴 분석: 사용자 인터랙션 행동 패턴 이해
 *
 * 사용 예:
 * - 버튼 클릭 -> 데이터 로딩 -> UI 업데이트 완료까지의 시간 측정
 * - 폼 제출 -> 서버 처리 -> 결과 표시까지의 시간 측정
 *
 * @param interactionName - 로깅 시 표시할 인터랙션 이름
 * @returns 인터랙션 추적 시작/종료 함수
 */

// 상호작용 성능 측정 옵션
type InteractionMetricsOptions = {
  componentName: string; // 측정 대상 컴포넌트 이름
  interactionType: string; // 상호작용 유형 (예: click, scroll 등)
  eventSelector?: string; // 이벤트 대상 선택자
};

/**
 * 사용자 상호작용 성능을 측정하는 React 훅
 *
 * @param options - 측정 옵션
 */
export function useInteractionMetrics({
  componentName,
  interactionType,
  eventSelector,
}: InteractionMetricsOptions) {
  // 이벤트 핸들러 참조 저장
  const handlerRef = useRef<any>(null);
  // 상호작용 시작 시간 저장
  const startTimeRef = useRef<number>(0);

  /**
   * 인터랙션 추적 시작
   * 인터랙션이 시작될 때 호출 (예: 버튼 클릭 시)
   */
  const trackInteractionStart = useCallback(() => {
    // 현재 시간 기록
    startTimeRef.current = performance.now();

    // 개발 환경에서만 로깅
    if (isDev()) {
      console.log(`[${componentName}] 상호작용 시작`);
    }
  }, [componentName]);

  /**
   * 인터랙션 추적 종료
   * 인터랙션 처리가 완료될 때 호출 (예: 데이터 로드 후 UI 업데이트 완료 시)
   */
  const trackInteractionEnd = useCallback(() => {
    // 시작점이 없는 경우 경고
    if (startTimeRef.current === 0) {
      if (isDev()) {
        console.warn(`[${componentName}] 상호작용 종료 호출되었으나 시작점이 없습니다.`);
      }
      return;
    }

    // 종료 시간 및 기간 계산
    const endTime = performance.now();
    const duration = endTime - startTimeRef.current;

    // 개발 환경에서만 로깅
    if (isDev()) {
      // 인터랙션 완료 로깅
      console.log(`[${componentName}] 상호작용 완료: ${duration.toFixed(2)}ms`);

      // 느린 인터랙션 감지 및 경고
      // 200ms는 사용자가 지연을 느끼기 시작하는 임계값에 가까움
      if (duration > 200) {
        console.warn(`[${componentName}] 느린 상호작용 감지: ${duration.toFixed(2)}ms`);
      }
    }

    // 성능 데이터 수집이 필요한 경우 프로덕션에서도 수집 가능
    // 이 경우 로깅 대신 별도의 분석 시스템으로 전송

    // 추적 리셋
    startTimeRef.current = 0;
  }, [componentName]);

  // 추적 시작/종료 함수 반환
  return {
    trackInteractionStart,
    trackInteractionEnd,
  };
}
