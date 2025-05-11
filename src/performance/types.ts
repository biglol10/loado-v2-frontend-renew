/**
 * 측정된 성능 데이터 타입
 */
export interface IPerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
}

/**
 * 페이지 로드 관련 성능 메트릭
 */
export interface IPageLoadMetrics {
  // DOM 콘텐츠 로드 시간
  domContentLoaded: number;
  // 페이지 로드 완료 시간
  pageLoad: number;
  // 첫 번째 콘텐츠풀 페인트
  firstContentfulPaint?: number;
  // 최대 콘텐츠풀 페인트
  largestContentfulPaint?: number;
  // 첫 입력 지연
  firstInputDelay?: number;
  // 누적 레이아웃 변경
  cumulativeLayoutShift?: number;
}

/**
 * 리소스 로드 성능 메트릭
 */
export interface IResourceMetrics {
  url: string;
  initiatorType: string;
  duration: number;
  transferSize: number;
  decodedBodySize: number;
}

/**
 * 사용자 상호작용 성능 메트릭
 */
export interface IInteractionMetrics {
  type: string;
  target: string;
  duration: number;
  timestamp: number;
}

/**
 * API 호출 성능 메트릭
 */
export interface IApiMetrics {
  url: string;
  method: string;
  status: number;
  duration: number;
  timestamp: number;
}

/**
 * 렌더링 성능 메트릭
 */
export interface IRenderMetrics {
  componentName: string;
  renderTime: number;
  timestamp: number;
}

/**
 * 저장소 관리자에 전달할 모든 성능 메트릭
 */
export interface IAllPerformanceMetrics {
  pageLoad?: IPageLoadMetrics;
  resources?: IResourceMetrics[];
  interactions?: IInteractionMetrics[];
  api?: IApiMetrics[];
  render?: IRenderMetrics[];
  memory?: {
    jsHeapSizeLimit?: number;
    totalJSHeapSize?: number;
    usedJSHeapSize?: number;
  };
}

/**
 * 성능 매니저가 구현해야 할 인터페이스
 */
export interface IPerformanceManager {
  // 페이지 로드 성능 측정
  measurePageLoad(): void;

  // 리소스 로드 성능 측정
  measureResourceLoad(): void;

  // API 호출 성능 측정 시작
  startApiMeasurement(url: string, method: string): string;

  // API 호출 성능 측정 종료
  endApiMeasurement(id: string, status: number): void;

  // 컴포넌트 렌더링 성능 측정 시작
  startRenderMeasurement(componentName: string): string;

  // 컴포넌트 렌더링 성능 측정 종료
  endRenderMeasurement(id: string): void;

  // 메모리 사용량 측정
  measureMemoryUsage(): void;

  // 모든 성능 메트릭 가져오기
  getAllMetrics(): IAllPerformanceMetrics;

  // 로그에 성능 메트릭 출력
  logMetrics(): void;

  // 메트릭 초기화
  clearMetrics(): void;
}
