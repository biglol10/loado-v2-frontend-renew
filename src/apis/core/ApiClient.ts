import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiError } from './ApiError';
import { RequestCanceler } from './RequestCanceler';

/**
 * API 클라이언트 클래스
 *
 * HTTP 요청을 처리하기 위한 중앙 집중식 클라이언트를 제공합니다.
 *
 * 이점:
 * 1. 중앙화된 설정: 모든 API 요청에 대한 일관된 설정 관리
 * 2. 에러 처리 표준화: 모든 API 오류에 대한 일관된 처리 로직
 * 3. 재시도 메커니즘: 필요한 경우 API 요청 자동 재시도
 * 4. 요청 취소: 중복 요청 방지 및 사용자 취소 지원
 * 5. 요청/응답 로깅: 디버깅을 위한 요청 및 응답 자동 로깅
 */
export class ApiClient {
  private instance: AxiosInstance;
  private requestCanceler: RequestCanceler;

  /**
   * ApiClient 생성자
   *
   * @param baseURL API 기본 URL
   * @param timeout 요청 제한 시간 (밀리초)
   * @param defaultHeaders 기본 헤더
   */
  constructor(
    baseURL: string = '',
    timeout: number = 30000,
    defaultHeaders: Record<string, string> = {}
  ) {
    // Axios 인스턴스 생성
    this.instance = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
        ...defaultHeaders,
      },
      withCredentials: true,
    });

    this.requestCanceler = new RequestCanceler();

    // 인터셉터 설정
    this.setupInterceptors();
  }

  /**
   * 요청/응답 인터셉터 설정
   */
  private setupInterceptors(): void {
    // 요청 인터셉터
    this.instance.interceptors.request.use(
      (config) => {
        // 개발 환경에서 요청 로깅
        if (process.env.NODE_ENV === 'development') {
          console.log(
            `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`,
            config.data || config.params
          );
        }

        // 요청 취소 토큰 설정
        const requestId = this.getRequestId(config);
        this.requestCanceler.register(requestId, config);

        // 보호된 엔드포인트에 인증 헤더 추가
        this.addAuthHeaders(config);

        return config;
      },
      (error) => {
        console.error('🔴 Request error:', error);
        return Promise.reject(error);
      }
    );

    // 응답 인터셉터
    this.instance.interceptors.response.use(
      (response) => {
        // 성공적인 응답 처리
        const requestId = this.getRequestId(response.config);
        this.requestCanceler.unregister(requestId);

        // 개발 환경에서 응답 로깅
        if (process.env.NODE_ENV === 'development') {
          console.log(
            `✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`,
            response.data
          );
        }

        return response;
      },
      (error) => {
        // 에러 응답 처리
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
          return Promise.reject(new ApiError('request_canceled', 'Request was canceled', error));
        }

        // 요청 ID가 있으면 취소 등록 해제
        if (error.config) {
          const requestId = this.getRequestId(error.config);
          this.requestCanceler.unregister(requestId);
        }

        // API 응답 오류 변환
        if (error.response) {
          const statusCode = error.response.status;
          const errorResponse = error.response.data;

          // 특정 상태 코드에 대한 처리
          if (statusCode === 429) {
            return Promise.reject(
              new ApiError('rate_limit_exceeded', 'API rate limit exceeded', error)
            );
          } else if (statusCode === 401) {
            return Promise.reject(new ApiError('unauthorized', 'Authentication required', error));
          } else if (statusCode === 403) {
            return Promise.reject(new ApiError('forbidden', 'Access forbidden', error));
          } else if (statusCode >= 500) {
            return Promise.reject(new ApiError('server_error', 'Server error occurred', error));
          }

          return Promise.reject(
            new ApiError('api_error', errorResponse.message || 'API error', error)
          );
        }

        // 네트워크 오류
        if (error.request) {
          return Promise.reject(new ApiError('network_error', 'Network error', error));
        }

        // 기타 에러
        return Promise.reject(
          new ApiError('unknown_error', error.message || 'Unknown error', error)
        );
      }
    );
  }

  /**
   * 요청 구성으로부터 고유 요청 ID 생성
   */
  private getRequestId(config: AxiosRequestConfig): string {
    const { method = 'get', url = '', data, params } = config;
    return `${method}:${url}:${JSON.stringify(data || params || {})}`;
  }

  /**
   * 보호된 엔드포인트에 인증 헤더 추가
   */
  private addAuthHeaders(config: AxiosRequestConfig): void {
    const { url = '' } = config;
    const PROTECTED_ENDPOINTS = ['/lostark/markets/items', '/lostark/auctions/items'];

    if (PROTECTED_ENDPOINTS.some((endpoint) => url.endsWith(endpoint))) {
      config.headers = {
        ...config.headers,
        Authorization: `bearer ${process.env.SIMEGATE_TOKEN}`,
      };
    }
  }

  /**
   * GET 요청 수행
   *
   * @param url 엔드포인트 URL
   * @param params URL 쿼리 파라미터
   * @param config 추가 Axios 설정
   * @returns 응답 데이터
   */
  public async get<T>(
    url: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.instance.get<T>(url, {
        params,
        ...config,
      });
      return response.data;
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  /**
   * POST 요청 수행
   *
   * @param url 엔드포인트 URL
   * @param data 요청 바디 데이터
   * @param config 추가 Axios 설정
   * @returns 응답 데이터
   */
  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.instance.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  /**
   * PUT 요청 수행
   *
   * @param url 엔드포인트 URL
   * @param data 요청 바디 데이터
   * @param config 추가 Axios 설정
   * @returns 응답 데이터
   */
  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.instance.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  /**
   * DELETE 요청 수행
   *
   * @param url 엔드포인트 URL
   * @param config 추가 Axios 설정
   * @returns 응답 데이터
   */
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.instance.delete<T>(url, config);
      return response.data;
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  /**
   * 에러 처리 및 필요시 재시도 로직
   *
   * @param error 발생한 에러
   * @returns 재시도 결과 또는 에러 재발생
   */
  private async handleError<T>(error: any): Promise<T> {
    // 이미 ApiError로 변환된 경우
    if (error instanceof ApiError) {
      // 속도 제한 에러인 경우 재시도 로직
      if (error.code === 'rate_limit_exceeded') {
        // 여기에 재시도 로직 구현
        console.log('Rate limit exceeded, implementing retry logic...');
        // 예: 1분 대기 후 재시도
        // await new Promise(resolve => setTimeout(resolve, 60 * 1000));
        // return this.retryRequest<T>(error.originalError.config);
      }

      throw error;
    }

    // 원본 에러 발생
    throw error;
  }

  /**
   * 요청 재시도 메서드
   *
   * @param config 원본 요청 설정
   * @returns 재시도 응답
   */
  private async retryRequest<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.request<T>(config);
    return response.data;
  }

  /**
   * 활성 요청 취소
   *
   * @param reason 취소 이유 (선택 사항)
   */
  public cancelActiveRequests(reason?: string): void {
    this.requestCanceler.cancelAll(reason || 'Request canceled by user');
  }
}

// 기본 API 클라이언트 인스턴스 생성
const BASE_URL = process.env.NODE_ENV === 'development' ? '' : process.env.REACT_APP_BASE_URL;
export const apiClient = new ApiClient(BASE_URL);

export default apiClient;
