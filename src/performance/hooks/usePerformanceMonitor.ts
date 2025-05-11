import { useEffect, useRef } from 'react';
import PerformanceManager from '../PerformanceManager';

/**
 * 컴포넌트 렌더링 성능을 측정하는 훅
 * @param componentName 컴포넌트 이름
 */
export const useRenderPerformance = (componentName: string) => {
  const perfManager = PerformanceManager.getInstance();
  const renderIdRef = useRef<string>('');

  useEffect(() => {
    // 마운트 시 측정 시작
    renderIdRef.current = perfManager.startRenderMeasurement(componentName);

    return () => {
      // 언마운트 시 측정 종료
      if (renderIdRef.current) {
        perfManager.endRenderMeasurement(renderIdRef.current);
      }
    };
  }, [componentName]);
};

/**
 * API 호출 성능을 측정하는 함수
 * @param url 요청 URL
 * @param method 요청 메서드
 * @returns API 측정 함수들
 */
export const useApiPerformance = () => {
  const perfManager = PerformanceManager.getInstance();

  const startApiCall = (url: string, method: string) => {
    return perfManager.startApiMeasurement(url, method);
  };

  const endApiCall = (id: string, status: number) => {
    perfManager.endApiMeasurement(id, status);
  };

  return { startApiCall, endApiCall };
};

/**
 * 현재 페이지 성능 메트릭을 가져오는 훅
 * @returns 모든 성능 메트릭
 */
export const usePerformanceMetrics = () => {
  const perfManager = PerformanceManager.getInstance();

  return {
    getMetrics: () => perfManager.getAllMetrics(),
    logMetrics: () => perfManager.logMetrics(),
    clearMetrics: () => perfManager.clearMetrics(),
    measureMemoryUsage: () => perfManager.measureMemoryUsage(),
  };
};
