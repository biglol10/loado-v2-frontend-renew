import { isLocalOrDevEnvironment } from '@/utils/envUtils';
import {
  IAllPerformanceMetrics,
  IApiMetrics,
  IInteractionMetrics,
  IPageLoadMetrics,
  IPerformanceManager,
  IRenderMetrics,
  IResourceMetrics,
} from './types';
import { debounce } from 'lodash';

/**
 * 성능 모니터링 시스템 매니저 클래스
 * 로컬 또는 개발 환경에서만 작동
 */
class PerformanceManager implements IPerformanceManager {
  private static instance: PerformanceManager;
  private metrics: IAllPerformanceMetrics = {};
  private apiMeasurements: Map<string, { startTime: number; url: string; method: string }> =
    new Map();
  private renderMeasurements: Map<string, { startTime: number; componentName: string }> = new Map();
  private isEnabled: boolean;

  private constructor() {
    this.isEnabled = isLocalOrDevEnvironment();
    this.metrics = {
      pageLoad: undefined,
      resources: [],
      interactions: [],
      api: [],
      render: [],
      memory: {},
    };

    if (this.isEnabled) {
      this.initialize();
    }
  }

  /**
   * 싱글톤 인스턴스 가져오기
   */
  public static getInstance(): PerformanceManager {
    if (!PerformanceManager.instance) {
      PerformanceManager.instance = new PerformanceManager();
    }
    return PerformanceManager.instance;
  }

  /**
   * 성능 모니터링 시스템 초기화
   */
  private initialize(): void {
    this.measurePageLoad();
    this.measureResourceLoad();
    this.setupUserInteractionObserver();

    // 정기적으로 메모리 사용량 측정
    setInterval(() => {
      this.measureMemoryUsage();
    }, 30000); // 30초마다 측정

    // 콘솔에 주기적으로 메트릭 표시
    const debouncedLogMetrics = debounce(
      () => {
        this.logMetrics();
      },
      5000,
      { maxWait: 10000 }
    );

    // 페이지 성능 변경시 로깅
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'largest-contentful-paint' && this.metrics.pageLoad) {
          this.metrics.pageLoad.largestContentfulPaint = entry.startTime;
          debouncedLogMetrics();
        } else if (entry.entryType === 'first-input' && this.metrics.pageLoad) {
          // PerformanceEventTiming 형식으로 캐스팅
          const firstInputEntry = entry as any; // PerformanceEventTiming
          if (firstInputEntry.processingStart && firstInputEntry.startTime) {
            this.metrics.pageLoad.firstInputDelay =
              firstInputEntry.processingStart - firstInputEntry.startTime;
            debouncedLogMetrics();
          }
        } else if (entry.entryType === 'layout-shift' && this.metrics.pageLoad) {
          // LayoutShift 형식으로 캐스팅
          const metric = entry as any; // LayoutShift
          if (this.metrics.pageLoad.cumulativeLayoutShift === undefined) {
            this.metrics.pageLoad.cumulativeLayoutShift = 0;
          }
          if (metric.value !== undefined) {
            this.metrics.pageLoad.cumulativeLayoutShift += metric.value;
            debouncedLogMetrics();
          }
        }
      });
    });

    // 다양한 성능 지표 관찰
    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });

    // 페이지 언로드 시 모든 메트릭 로깅
    window.addEventListener('beforeunload', () => {
      this.logMetrics();
    });
  }

  /**
   * 페이지 로드 성능 측정
   */
  public measurePageLoad(): void {
    if (!this.isEnabled) return;

    const navigationEntry = performance.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      this.metrics.pageLoad = {
        domContentLoaded: navigationEntry.domContentLoadedEventEnd - navigationEntry.startTime,
        pageLoad: navigationEntry.loadEventEnd - navigationEntry.startTime,
      };

      // FCP (First Contentful Paint) 측정
      const paintEntries = performance.getEntriesByType('paint');
      const firstPaint = paintEntries.find((entry) => entry.name === 'first-paint');
      const firstContentfulPaint = paintEntries.find(
        (entry) => entry.name === 'first-contentful-paint'
      );

      if (firstContentfulPaint) {
        this.metrics.pageLoad.firstContentfulPaint = firstContentfulPaint.startTime;
      }
    }
  }

  /**
   * 리소스 로드 성능 측정
   */
  public measureResourceLoad(): void {
    if (!this.isEnabled) return;

    const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    this.metrics.resources = resourceEntries.map((entry) => ({
      url: entry.name,
      initiatorType: entry.initiatorType,
      duration: entry.duration,
      transferSize: entry.transferSize,
      decodedBodySize: entry.decodedBodySize,
    }));
  }

  /**
   * 사용자 상호작용 옵저버 설정
   */
  private setupUserInteractionObserver(): void {
    if (!this.isEnabled) return;

    // 클릭, 키보드 입력 등의 이벤트 측정
    ['click', 'keydown', 'submit'].forEach((eventType) => {
      document.addEventListener(
        eventType,
        (event) => {
          const target = event.target as HTMLElement;
          const tagName = target.tagName.toLowerCase();
          const id = target.id ? `#${target.id}` : '';
          // SVG 요소의 className은 문자열이 아닌 SVGAnimatedString이므로 getAttribute로 안전하게 읽는다.
          const classAttr = target.getAttribute?.('class') ?? '';
          const className = classAttr ? `.${classAttr.trim().replace(/\s+/g, '.')}` : '';
          const targetIdentifier = `${tagName}${id}${className}`;

          const startTime = performance.now();

          // 이벤트 처리 완료 시간 측정
          setTimeout(() => {
            const endTime = performance.now();
            const duration = endTime - startTime;

            if (!this.metrics.interactions) {
              this.metrics.interactions = [];
            }

            this.metrics.interactions.push({
              type: eventType,
              target: targetIdentifier,
              duration,
              timestamp: Date.now(),
            });
          }, 0);
        },
        { capture: true }
      );
    });
  }

  /**
   * API 호출 성능 측정 시작
   * @param url 요청 URL
   * @param method 요청 메서드
   * @returns 측정 ID
   */
  public startApiMeasurement(url: string, method: string): string {
    if (!this.isEnabled) return '';

    const id = `api_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.apiMeasurements.set(id, {
      startTime: performance.now(),
      url,
      method,
    });
    return id;
  }

  /**
   * API 호출 성능 측정 종료
   * @param id 측정 ID
   * @param status HTTP 상태 코드
   */
  public endApiMeasurement(id: string, status: number): void {
    if (!this.isEnabled || !id) return;

    const measurement = this.apiMeasurements.get(id);
    if (measurement) {
      const { startTime, url, method } = measurement;
      const endTime = performance.now();
      const duration = endTime - startTime;

      if (!this.metrics.api) {
        this.metrics.api = [];
      }

      this.metrics.api.push({
        url,
        method,
        status,
        duration,
        timestamp: Date.now(),
      });

      this.apiMeasurements.delete(id);

      // API 호출이 너무 오래 걸리면 경고
      if (duration > 1000) {
        console.warn(`🚨 Slow API call: ${method} ${url} took ${duration.toFixed(2)}ms`);
      }
    }
  }

  /**
   * 컴포넌트 렌더링 성능 측정 시작
   * @param componentName 컴포넌트 이름
   * @returns 측정 ID
   */
  public startRenderMeasurement(componentName: string): string {
    if (!this.isEnabled) return '';

    const id = `render_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.renderMeasurements.set(id, {
      startTime: performance.now(),
      componentName,
    });
    return id;
  }

  /**
   * 컴포넌트 렌더링 성능 측정 종료
   * @param id 측정 ID
   */
  public endRenderMeasurement(id: string): void {
    if (!this.isEnabled || !id) return;

    const measurement = this.renderMeasurements.get(id);
    if (measurement) {
      const { startTime, componentName } = measurement;
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      if (!this.metrics.render) {
        this.metrics.render = [];
      }

      this.metrics.render.push({
        componentName,
        renderTime,
        timestamp: Date.now(),
      });

      this.renderMeasurements.delete(id);

      // 렌더링이 너무 오래 걸리면 경고
      if (renderTime > 50) {
        console.warn(
          `🚨 Slow rendering: Component ${componentName} took ${renderTime.toFixed(2)}ms to render`
        );
      }
    }
  }

  /**
   * 메모리 사용량 측정
   */
  public measureMemoryUsage(): void {
    if (!this.isEnabled) return;

    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      this.metrics.memory = {
        jsHeapSizeLimit: memoryInfo.jsHeapSizeLimit,
        totalJSHeapSize: memoryInfo.totalJSHeapSize,
        usedJSHeapSize: memoryInfo.usedJSHeapSize,
      };
    }
  }

  /**
   * 모든 성능 메트릭 가져오기
   * @returns 모든 성능 메트릭
   */
  public getAllMetrics(): IAllPerformanceMetrics {
    return this.metrics;
  }

  /**
   * 로그에 성능 메트릭 출력
   */
  public logMetrics(): void {
    if (!this.isEnabled) return;

    console.group(
      '%c🔍 Performance Metrics',
      'font-weight: bold; font-size: 16px; color: #38b2ac;'
    );

    // 페이지 로드 메트릭
    if (this.metrics.pageLoad) {
      console.group('%c📄 Page Load Metrics', 'font-weight: bold; color: #4299e1;');
      console.log(`Dom Content Loaded: ${this.metrics.pageLoad.domContentLoaded.toFixed(2)}ms`);
      console.log(`Page Load: ${this.metrics.pageLoad.pageLoad.toFixed(2)}ms`);
      if (this.metrics.pageLoad.firstContentfulPaint) {
        console.log(
          `First Contentful Paint: ${this.metrics.pageLoad.firstContentfulPaint.toFixed(2)}ms`
        );
      }
      if (this.metrics.pageLoad.largestContentfulPaint) {
        console.log(
          `Largest Contentful Paint: ${this.metrics.pageLoad.largestContentfulPaint.toFixed(2)}ms`
        );
      }
      if (this.metrics.pageLoad.firstInputDelay) {
        console.log(`First Input Delay: ${this.metrics.pageLoad.firstInputDelay.toFixed(2)}ms`);
      }
      if (this.metrics.pageLoad.cumulativeLayoutShift !== undefined) {
        console.log(
          `Cumulative Layout Shift: ${this.metrics.pageLoad.cumulativeLayoutShift.toFixed(4)}`
        );
      }
      console.groupEnd();
    }

    // API 호출 메트릭
    if (this.metrics.api && this.metrics.api.length > 0) {
      console.group('%c🌐 API Metrics (Last 10 calls)', 'font-weight: bold; color: #805ad5;');

      // 가장 느린 API 호출 5개 필터링
      const sortedApiCalls = [...this.metrics.api].sort((a, b) => b.duration - a.duration);
      const topSlowCalls = sortedApiCalls.slice(0, 5);

      topSlowCalls.forEach((api) => {
        const color = api.duration > 1000 ? 'color: #e53e3e;' : 'color: #38a169;';
        console.log(
          `%c${api.method} ${api.url} - ${api.status}: ${api.duration.toFixed(2)}ms`,
          color
        );
      });

      // 평균 API 호출 시간
      const avgApiTime =
        sortedApiCalls.reduce((acc, curr) => acc + curr.duration, 0) / sortedApiCalls.length;
      console.log(`Average API call time: ${avgApiTime.toFixed(2)}ms`);

      console.groupEnd();
    }

    // 컴포넌트 렌더링 메트릭
    if (this.metrics.render && this.metrics.render.length > 0) {
      console.group(
        '%c⚛️ Component Render Metrics (Top 5 slowest)',
        'font-weight: bold; color: #dd6b20;'
      );

      // 가장 느린 렌더링 5개 필터링
      const sortedRenders = [...this.metrics.render].sort((a, b) => b.renderTime - a.renderTime);
      const topSlowRenders = sortedRenders.slice(0, 5);

      topSlowRenders.forEach((render) => {
        const color = render.renderTime > 50 ? 'color: #e53e3e;' : 'color: #38a169;';
        console.log(`%c${render.componentName}: ${render.renderTime.toFixed(2)}ms`, color);
      });

      console.groupEnd();
    }

    // 메모리 사용량 메트릭
    if (this.metrics.memory && this.metrics.memory.usedJSHeapSize) {
      console.group('%c💾 Memory Usage', 'font-weight: bold; color: #319795;');

      const usedMB = (this.metrics.memory?.usedJSHeapSize ?? 0) / (1024 * 1024);
      const totalMB = (this.metrics.memory?.totalJSHeapSize ?? 0) / (1024 * 1024);
      const limitMB = (this.metrics.memory?.jsHeapSizeLimit ?? 1) / (1024 * 1024);

      console.log(`Used JS Heap: ${usedMB.toFixed(2)} MB`);
      console.log(`Total JS Heap: ${totalMB.toFixed(2)} MB`);
      console.log(`JS Heap Limit: ${limitMB.toFixed(2)} MB`);

      const usagePercentage = (usedMB / limitMB) * 100;
      const color = usagePercentage > 80 ? 'color: #e53e3e;' : 'color: #38a169;';
      console.log(`%cHeap Usage: ${usagePercentage.toFixed(2)}%`, color);

      console.groupEnd();
    }

    // 리소스 메트릭
    if (this.metrics.resources && this.metrics.resources.length > 0) {
      console.group('%c📦 Resource Metrics', 'font-weight: bold; color: #3182ce;');

      // 리소스 크기 합계
      const totalTransferSize = this.metrics.resources.reduce(
        (acc, curr) => acc + curr.transferSize,
        0
      );
      const totalMB = totalTransferSize / (1024 * 1024);

      console.log(`Total resources: ${this.metrics.resources.length}`);
      console.log(`Total transfer size: ${totalMB.toFixed(2)} MB`);

      // 큰 리소스 (100KB 이상) 찾기
      const largeResources = this.metrics.resources.filter((r) => r.transferSize > 100 * 1024);
      if (largeResources.length > 0) {
        console.group('Large resources (>100KB):');
        largeResources.forEach((resource) => {
          const sizeMB = resource.transferSize / (1024 * 1024);
          console.log(`${resource.url.split('/').pop()} - ${sizeMB.toFixed(2)} MB`);
        });
        console.groupEnd();
      }

      console.groupEnd();
    }

    console.groupEnd();
  }

  /**
   * 메트릭 초기화
   */
  public clearMetrics(): void {
    this.metrics = {
      pageLoad: this.metrics.pageLoad, // 페이지 로드 메트릭은 유지
      resources: [],
      interactions: [],
      api: [],
      render: [],
      memory: this.metrics.memory, // 메모리 메트릭도 유지
    };

    this.apiMeasurements.clear();
    this.renderMeasurements.clear();
  }
}

export default PerformanceManager;
