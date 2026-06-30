import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import PerformanceManager from './PerformanceManager';
import { isLocalOrDevEnvironment } from '@/utils/envUtils';

/**
 * Axios 성능 모니터링 인터셉터
 * API 호출 시간을 측정하고 느린 요청에 대한 경고를 표시합니다.
 */
class AxiosPerformanceInterceptor {
  private static instance: AxiosPerformanceInterceptor;
  private performanceManager: PerformanceManager;
  private isEnabled: boolean;
  private interceptorIds?: {
    request: number;
    response: number;
  };

  // 요청 ID와 시작 시간을 저장하는 맵
  private requestTimings: Map<string, { startTime: number; url: string; method: string }> =
    new Map();

  private constructor() {
    this.performanceManager = PerformanceManager.getInstance();
    this.isEnabled = isLocalOrDevEnvironment();
  }

  /**
   * 싱글톤 인스턴스 가져오기
   */
  public static getInstance(): AxiosPerformanceInterceptor {
    if (!AxiosPerformanceInterceptor.instance) {
      AxiosPerformanceInterceptor.instance = new AxiosPerformanceInterceptor();
    }
    return AxiosPerformanceInterceptor.instance;
  }

  /**
   * 요청 인터셉터 설정
   * @param config Axios 요청 설정
   * @returns 요청 설정
   */
  public requestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (!this.isEnabled) return config;

    const requestId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // 요청 ID를 헤더에 추가 (추적용)
    config.headers = config.headers || {};
    config.headers['X-Request-ID'] = requestId;

    // 타이밍 정보 저장
    this.requestTimings.set(requestId, {
      startTime: performance.now(),
      url: config.url || 'unknown',
      method: config.method?.toUpperCase() || 'unknown',
    });

    return config;
  };

  /**
   * 응답 인터셉터 설정
   * @param response Axios 응답
   * @returns 응답
   */
  public responseInterceptor = (response: AxiosResponse): AxiosResponse => {
    if (!this.isEnabled) return response;

    const { config } = response;
    const requestId = config.headers?.['X-Request-ID'] as string;

    if (requestId && this.requestTimings.has(requestId)) {
      const { startTime, url, method } = this.requestTimings.get(requestId)!;
      const endTime = performance.now();
      const duration = endTime - startTime;

      // PerformanceManager에 API 호출 정보 전달
      this.performanceManager.endApiMeasurement(
        this.performanceManager.startApiMeasurement(url, method),
        response.status
      );

      // 타이밍 맵에서 제거
      this.requestTimings.delete(requestId);

      // 느린 요청 경고 (500ms 이상)
      if (duration > 500) {
        console.warn(`🐢 Slow API call: ${method} ${url} took ${duration.toFixed(2)}ms`);
      }
    }

    return response;
  };

  /**
   * 응답 에러 인터셉터 설정
   * @param error Axios 에러
   * @returns rejected 프로미스
   */
  public responseErrorInterceptor = (error: unknown) => {
    if (!this.isEnabled) return Promise.reject(error);

    if (axios.isCancel(error)) {
      const message = error instanceof Error ? error.message : String(error);
      console.log('Request canceled:', message);
      return Promise.reject(error);
    }

    const axiosError = axios.isAxiosError(error) ? error : undefined;
    const config = axiosError?.config;
    if (config) {
      const requestId = config.headers?.['X-Request-ID'] as string;

      if (requestId && this.requestTimings.has(requestId)) {
        const { startTime, url, method } = this.requestTimings.get(requestId)!;
        const endTime = performance.now();
        const duration = endTime - startTime;

        // 에러 상태 코드 (기본값 500)
        const status = axiosError?.response?.status || 500;

        // PerformanceManager에 API 호출 정보 전달
        this.performanceManager.endApiMeasurement(
          this.performanceManager.startApiMeasurement(url, method),
          status
        );

        // 타이밍 맵에서 제거
        this.requestTimings.delete(requestId);

        console.error(`❌ API error: ${method} ${url} - ${status} (${duration.toFixed(2)}ms)`);
      }
    }

    return Promise.reject(error);
  };

  /**
   * Axios 인스턴스에 인터셉터 적용
   * @param axiosInstance Axios 인스턴스
   */
  public applyInterceptors(axiosInstance: AxiosInstance): void {
    if (!this.isEnabled || this.interceptorIds) return;

    const request = axiosInstance.interceptors.request.use(this.requestInterceptor, (error) =>
      Promise.reject(error)
    );

    const response = axiosInstance.interceptors.response.use(
      this.responseInterceptor,
      this.responseErrorInterceptor
    );

    this.interceptorIds = { request, response };
  }
}

export default AxiosPerformanceInterceptor;
