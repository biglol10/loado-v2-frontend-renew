/**
 * 성능 데이터 원격 수집 시스템
 *
 * 이 모듈은 애플리케이션 성능 데이터를 수집하고 배치로 서버에 전송합니다.
 *
 * 주요 기능:
 * - 성능 메트릭 수집
 * - 메트릭 배치 처리
 * - 정기적인 메트릭 전송
 * - 페이지 언로드 시 메트릭 보존
 *
 * 이점:
 * 1. 실제 사용자 환경 모니터링: 개발 환경이 아닌 실제 사용자 환경에서의 성능 측정
 * 2. 데이터 기반 최적화: 수집된 데이터를 바탕으로 성능 병목 식별 및 개선
 * 3. 성능 추세 분석: 시간에 따른 성능 변화 추적
 * 4. 다양한 기기/브라우저 환경 비교: 서로 다른 환경에서의 성능 차이 분석
 */

import { isDev } from '../environment';

// 성능 메트릭 타입 정의
type PerformanceMetric = {
  name: string; // 메트릭 이름
  value: number; // 메트릭 값
  timestamp: number; // 측정 시간
  meta?: Record<string, any>; // 추가 메타데이터
};

// 전송 대기 중인 메트릭 저장 배열
const metrics: PerformanceMetric[] = [];
// 정기 전송 인터벌 참조
let batchSendInterval: number | null = null;

/**
 * 성능 리포터 초기화
 *
 * @param endpoint - 메트릭을 전송할 서버 엔드포인트
 * @param intervalMs - 메트릭 전송 주기(밀리초) (기본값: 60초)
 */
export function initPerformanceReporter(endpoint: string, intervalMs = 60000) {
  // 이미 설정된 인터벌이 있으면 초기화
  if (batchSendInterval) {
    clearInterval(batchSendInterval);
  }

  // 정기적인 메트릭 전송 인터벌 설정
  batchSendInterval = window.setInterval(() => {
    if (metrics.length > 0) {
      sendMetricsBatch(endpoint);
    }
  }, intervalMs);

  // 페이지 언로드 시 수집된 메트릭 전송
  window.addEventListener('beforeunload', () => {
    if (metrics.length > 0) {
      sendMetricsBatch(endpoint, true);
    }
  });

  // 개발 환경에서만 초기화 로그 출력
  if (isDev()) {
    console.log(`성능 리포터 초기화 완료 (전송 주기: ${intervalMs}ms)`);
  }
}

/**
 * 새 성능 메트릭 기록
 * 이 함수는 개발 환경과 프로덕션 환경 모두에서 동작하지만,
 * 메트릭 데이터는 프로덕션 환경에서만 실제로 전송됩니다.
 *
 * @param name - 메트릭 이름
 * @param value - 메트릭 값
 * @param meta - 추가 메타데이터
 */
export function trackMetric(name: string, value: number, meta?: Record<string, any>) {
  // 모든 환경에서 메트릭 수집
  metrics.push({
    name,
    value,
    timestamp: Date.now(),
    meta,
  });

  // 개발 환경에서만 로깅
  if (isDev()) {
    console.log(`성능 메트릭 수집: ${name} = ${value}`, meta ? meta : '');
  }
}

/**
 * 수집된 메트릭 배치 전송
 *
 * @param endpoint - 메트릭을 전송할 서버 엔드포인트
 * @param useBeacon - 페이지 언로드 중 전송 여부
 */
function sendMetricsBatch(endpoint: string, useBeacon = false) {
  // 현재 배치의 메트릭 복사 (중간에 새로운 메트릭이 추가되는 경우 대비)
  const batch = [...metrics];
  // 전송할 메트릭 배열 비우기
  metrics.length = 0;

  // 개발 환경에서는 실제 전송 대신 로깅만 수행
  if (isDev()) {
    console.log(`성능 메트릭 배치 전송 시뮬레이션 (${batch.length}개 항목):`, batch);
    return; // 개발 환경에서는 실제 전송 수행하지 않음
  }

  // 프로덕션 환경에서는 실제 데이터 전송
  if (useBeacon && navigator.sendBeacon) {
    // Navigator.sendBeacon API 사용
    // 페이지 언로드 중에도 안정적으로 데이터 전송 가능
    navigator.sendBeacon(endpoint, JSON.stringify(batch));
  } else {
    // 일반 Fetch API 사용
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(batch),
      // 페이지 언로드 시에도 요청 완료 보장
      keepalive: true,
    }).catch((err) => {
      // 프로덕션 환경에서도 중요한 에러는 로깅 (하지만 제한적으로)
      console.error('성능 메트릭 전송 실패');
    });
  }
}
