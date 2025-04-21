import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { trackMetric } from './reporter';
import { isDev } from '../environment';

/**
 * 네트워크 요청 추적 시스템
 *
 * 이 모듈은 모든 Axios HTTP 요청의 성능을 자동으로 측정하고 추적합니다.
 *
 * 측정하는 정보:
 * - 요청 URL
 * - HTTP 메서드
 * - 상태 코드
 * - 응답 크기
 * - 요청 처리 시간
 * - 에러 정보
 *
 * 이점:
 * 1. 네트워크 병목 감지: 느린 요청 식별
 * 2. 에러 진단: 실패한 요청에 대한 자세한 정보 제공
 * 3. 응답 크기 모니터링: 대용량 응답 식별
 * 4. 요청 패턴 분석: 중복 요청 또는 불필요한 요청 식별
 * 5. 사용자 경험 개선: API 응답 시간이 사용자 경험에 미치는 영향 파악
 *
 * @param instance - 추적할 Axios 인스턴스 (기본값: 전역 axios)
 * @returns 추적 기능이 추가된 동일한 Axios 인스턴스
 */

export function trackNetworkRequests(instance: any) {
  // 프로덕션 환경에서는 로깅 없이 원본 인스턴스 반환
  if (!isDev()) {
    return instance;
  }

  // 원본 request 메서드 저장
  const originalRequest = instance.request;

  // 원본 메서드를 추적 기능이 추가된 새 메서드로 대체
  instance.request = function trackedRequest<T = any>(config: AxiosRequestConfig) {
    // 요청 시작 시간 기록
    const startTime = performance.now();
    // 요청 식별을 위한 고유 ID 생성
    const requestId = Math.random().toString(36).substring(2, 9);

    // 개발 환경에서만 요청 시작 로깅
    if (isDev()) {
      console.log(`[${requestId}] 요청 시작:`, config.url);
    }

    // 원본 요청 실행 후 응답 또는 에러 처리
    return originalRequest
      .call(this, config)
      .then((response: AxiosResponse<T>) => {
        // 요청 완료 시간 측정
        const endTime = performance.now();
        const duration = endTime - startTime;

        // 개발 환경에서만 성공적인 응답 로깅
        if (isDev()) {
          console.log(`[${requestId}] 요청 완료: ${duration.toFixed(2)}ms`, {
            url: config.url,
            method: config.method,
            status: response.status,
            size: JSON.stringify(response.data).length, // 응답 크기 추정
          });
        }

        return response;
      })
      .catch((error: AxiosError) => {
        // 요청 실패 시간 측정
        const endTime = performance.now();
        const duration = endTime - startTime;

        // 개발 환경에서만 실패한 요청 로깅
        if (isDev()) {
          console.error(`[${requestId}] 요청 실패: ${duration.toFixed(2)}ms`, {
            url: config.url,
            method: config.method,
            status: error.response?.status,
            error: error.message,
          });
        }

        // 원본 에러 전파
        throw error;
      });
  };

  // 추적 기능이 추가된 인스턴스 반환
  return instance;
}
