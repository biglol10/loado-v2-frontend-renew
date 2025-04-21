/**
 * 웹 핵심 성능 지표(Web Vitals) 측정 시스템
 *
 * 이 모듈은 Google의 Web Vitals 지표를 측정하고 추적합니다.
 *
 * 측정하는 주요 지표:
 * - CLS (Cumulative Layout Shift): 시각적 안정성
 * - FID (First Input Delay): 상호작용 응답성
 * - LCP (Largest Contentful Paint): 로딩 성능
 * - FCP (First Contentful Paint): 초기 렌더링 속도
 * - TTFB (Time to First Byte): 서버 응답 시간
 *
 * 이점:
 * 1. 사용자 경험 모니터링: 실제 사용자 경험에 영향을 미치는 핵심 지표 측정
 * 2. 성능 개선 방향 제시: 측정된 지표를 바탕으로 개선이 필요한 영역 식별
 * 3. 다양한 기기와 네트워크 환경에서의 성능 추적
 * 4. 지속적인 성능 모니터링으로 성능 저하 조기 감지
 */
import { isDev } from '../environment';

type MetricName = 'CLS' | 'FID' | 'LCP' | 'FCP' | 'TTFB';
type MetricValue = { name: MetricName; value: number; id: string };

// 측정된 웹 지표 저장소
const metrics: Record<MetricName, MetricValue | null> = {
  CLS: null, // Cumulative Layout Shift: 누적 레이아웃 변화량
  FID: null, // First Input Delay: 사용자가 처음 상호작용할 때의 지연 시간
  LCP: null, // Largest Contentful Paint: 가장 큰 콘텐츠 요소의 로드 시간
  FCP: null, // First Contentful Paint: 첫 콘텐츠가 화면에 표시되는 시간
  TTFB: null, // Time To First Byte: 서버 응답 시작까지의 시간
};

/**
 * Web Vitals 측정 초기화 함수
 *
 * @param callback - 각 지표가 측정될 때마다 호출될 콜백 함수
 */
export function initWebVitals(callback?: (metric: MetricValue) => void) {
  try {
    // web-vitals 라이브러리 동적 임포트 (npm install web-vitals가 필요합니다)
    import('web-vitals')
      .then(({ onCLS, onFID, onLCP, onFCP, onTTFB }) => {
        // 모든 지표에 공통으로 사용할 보고 콜백
        const reportCallback = (metric: { name: string; value: number; id: string }) => {
          const name = metric.name as MetricName;
          metrics[name] = metric as MetricValue;

          // 외부에서 제공된 콜백이 있으면 호출
          if (callback) {
            callback(metric as MetricValue);
          }

          // 개발 환경에서만 콘솔에 로깅
          if (isDev()) {
            console.log(`Web Vital: ${name}`, metric.value);
          }
        };

        // 각 Web Vital 지표 측정 시작
        onCLS(reportCallback); // 레이아웃 변화 측정
        onFID(reportCallback); // 첫 입력 지연 측정
        onLCP(reportCallback); // 최대 콘텐츠 요소 측정
        onFCP(reportCallback); // 첫 콘텐츠 페인트 측정
        onTTFB(reportCallback); // 첫 바이트까지의 시간 측정
      })
      .catch((err) => {
        // 개발 환경에서만 에러 로깅
        if (isDev()) {
          console.error('Web Vitals 라이브러리 로딩 실패:', err);
        }
      });
  } catch (err) {
    // 개발 환경에서만 에러 로깅
    if (isDev()) {
      console.error('Web Vitals 초기화 중 오류 발생:', err);
    }
  }
}

/**
 * 현재 측정된 Web Vitals 지표 조회
 *
 * @returns 측정된 모든 Web Vitals 지표
 */
export function getWebVitals() {
  return metrics;
}
