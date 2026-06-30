import PerformanceManager from './PerformanceManager';
import AxiosPerformanceInterceptor from './AxiosPerformanceInterceptor';
import { isLocalOrDevEnvironment } from '@/utils/envUtils';
import { AxiosInstance } from 'axios';

interface IPerformanceMonitoringHandle {
  performanceManager: PerformanceManager;
  axiosInterceptor: AxiosPerformanceInterceptor;
}

let monitoringHandle: IPerformanceMonitoringHandle | undefined;

// 성능 훅 내보내기
export {
  useRenderPerformance,
  useApiPerformance,
  usePerformanceMetrics,
} from './hooks/usePerformanceMonitor';
export { useMonitoredQuery } from './hooks/useMonitoredQuery';
export { default as PerformanceDashboard } from './components/PerformanceDashboard';

/**
 * 성능 모니터링 시스템 초기화
 * @param axiosInstance Axios 인스턴스
 */
export const initializePerformanceMonitoring = (axiosInstance: AxiosInstance) => {
  // 로컬 또는 개발 환경에서만 초기화
  if (!isLocalOrDevEnvironment()) {
    return;
  }

  if (monitoringHandle) {
    return monitoringHandle;
  }

  // 싱글톤 인스턴스 초기화
  const performanceManager = PerformanceManager.getInstance();

  // Axios 인터셉터 적용
  const axiosInterceptor = AxiosPerformanceInterceptor.getInstance();
  axiosInterceptor.applyInterceptors(axiosInstance);

  // 초기 페이지 로드 측정
  performanceManager.measurePageLoad();
  performanceManager.measureResourceLoad();
  performanceManager.measureMemoryUsage();

  // 비동기 콘솔 로그
  setTimeout(() => {
    console.log('%c🚀 Performance monitoring initialized', 'font-weight: bold; color: #3182ce;');
    performanceManager.logMetrics();
  }, 3000);

  monitoringHandle = {
    performanceManager,
    axiosInterceptor,
  };

  return monitoringHandle;
};

export default {
  initializePerformanceMonitoring,
  PerformanceManager,
  AxiosPerformanceInterceptor,
};
