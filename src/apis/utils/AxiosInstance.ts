import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import queryString from 'query-string';
import RequestLimitError from './RequestLimitError';
import _ from 'lodash';
import { hold } from '@/utils/utilityFunctions';
import axiosCanceler from './AxiosCanceler';
import { IApiResponseTemplate } from './types';
import { debounce } from 'lodash';

export type TApiMethod = 'get' | 'post' | 'put' | 'delete';

interface IRequestParam {
  method?: TApiMethod;
  url: string;
  data?: any;
  headers?: Record<string, string>;
  retryCount?: number;
  responseType?: ResponseType;
  showLoading?: boolean;
}

// 토큰 갱신 큐 클래스 추가
export class TokenRefreshQueue {
  private isRefreshing = false;
  private refreshQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: Error) => void;
  }> = [];

  isRefreshingToken() {
    return this.isRefreshing;
  }

  setRefreshing(refreshing: boolean) {
    this.isRefreshing = refreshing;
  }

  addToQueue(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.refreshQueue.push({ resolve, reject });
    });
  }

  processQueue(token: string | null, error?: Error) {
    if (token) {
      // 성공 시 대기 중인 모든 요청에 새 토큰 전달
      this.refreshQueue.forEach(({ resolve }) => resolve(token));
    } else {
      // 실패 시 대기 중인 모든 요청에 에러 전달
      this.refreshQueue.forEach(({ reject }) => reject(error || new Error('Token refresh failed')));
    }
    this.refreshQueue = [];
  }
}

const tokenQueue = new TokenRefreshQueue();
const RPS = 60 * 1020;
const MAX_RETCNT = 2;

const BASE_URL = process.env.NODE_ENV === 'development' ? '' : process.env.REACT_APP_BASE_URL;
const BASE_PREFIX = '/lostark';

const LOSTARK_API_MARKET = `${BASE_PREFIX}/markets/items`;
const LOSTARK_API_AUCTION = `${BASE_PREFIX}/auctions/items`;

const AxiosBaseInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 30000,
});

// 파일 응답 변환 기능 추가
const convertToFileResponse = <T>(response: AxiosResponse): IApiResponseTemplate<T> => {
  const contentDisposition = response.headers['content-disposition'];
  let fileName = 'download';

  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="?([^"]*)"?/);
    fileName = filenameMatch ? filenameMatch[1] : fileName;
  }

  return {
    result: 'success',
    data: {
      fileName: fileName,
      fileStream: new Blob([response?.data]),
    } as unknown as T,
  };
};

const handleRequest = (config: InternalAxiosRequestConfig<any>) => {
  const { url = '', data, headers, method } = config;

  const PROTECTED_ENDPOINTS = [LOSTARK_API_MARKET, LOSTARK_API_AUCTION];

  // 보호된 엔드포인트에 토큰 추가
  if (PROTECTED_ENDPOINTS.some((endpoint) => url.endsWith(endpoint))) {
    Object.assign(headers, {
      Authorization: `Bearer ${process.env.SIMEGATE_TOKEN}`,
    });
  } else {
    // 일반 엔드포인트에 토큰 추가 (로그인이 필요한 API의 경우)
    const token = localStorage.getItem('token');
    if (token) {
      Object.assign(headers, {
        Authorization: `Bearer ${token}`,
      });
    }
  }

  // 요청 취소 토큰 설정
  try {
    const requestKey = { url, data, method: method as TApiMethod };
    axiosCanceler.addRequest(requestKey);
    config.cancelToken = axiosCanceler.getCancelToken(requestKey)?.token;
  } catch (error) {
    console.error('Error adding request to axiosCanceler:', error);
  }
  // 로딩 상태 표시 (config에 showLoading 플래그가 있으면)
  if ((config as any).showLoading) {
    // 로딩 표시 로직을 여기에 추가 (예: loadingStore.show())
  }

  return config;
};

const handleRequestError = (error: any) => {
  // 로딩 상태 숨김
  // loadingStore.hide();
  return Promise.reject(error);
};

const handleResponseSuccess = async (response: AxiosResponse<any, any>) => {
  const { url = '', data, method } = response.config;
  axiosCanceler.removeRequest({ url, data, method: method as TApiMethod });

  // 429 상태 코드 처리 (요청 한도 초과)
  if (response.status === 429) {
    return Promise.reject(new RequestLimitError('Api Request Limit'));
  }

  // 파일 다운로드(Blob) 응답 처리
  if (response.data instanceof Blob) {
    // JSON 형식의 에러가 Blob으로 전달된 경우
    const contentType = response.headers['content-type'];
    if (contentType && contentType.includes('application/json')) {
      const text = await response.data.text();
      try {
        const parsedData = JSON.parse(text);
        return { ...response, data: parsedData };
      } catch (e) {
        // JSON 파싱 실패 시 원본 응답 반환
      }
    }
    // 실제 파일인 경우 파일 응답 형식으로 변환
    return { ...response, data: convertToFileResponse(response) };
  }

  // 로딩 상태 숨김
  // loadingStore.hide();
  return response;
};

// 잘못된 url, 잘못된 데이터, 잘못된 메서드 등 예외 처리
const handleResponseError = async (error: any) => {
  console.error('error in handleResponseError');

  // 로딩 상태 숨김
  // loadingStore.hide();

  const { response, config } = error;
  if (!config) return Promise.reject(error);

  const { url = '', data, method } = config;

  axiosCanceler.removeRequest({ url, data, method: method as TApiMethod });

  // 취소된 요청인 경우
  if (axios.isCancel(error)) {
    console.log('API request canceled: ', error);
    return Promise.reject(error);
  }

  // 응답이 없는 경우 (네트워크 오류 등)
  if (!response) {
    console.log('Network error: ', error);
    return Promise.reject(error);
  }

  // 401 에러 처리 (토큰 만료)
  if (response.status === 401) {
    try {
      // 토큰 갱신이 필요한 엔드포인트 확인 (보호된 엔드포인트는 제외)
      const PROTECTED_ENDPOINTS = [LOSTARK_API_MARKET, LOSTARK_API_AUCTION];
      const needsTokenRefresh = !PROTECTED_ENDPOINTS.some((endpoint) => url.endsWith(endpoint));

      if (needsTokenRefresh) {
        // 토큰 갱신 로직
        if (!tokenQueue.isRefreshingToken()) {
          tokenQueue.setRefreshing(true);

          // 토큰 갱신 요청 보내기
          const refreshResponse = await axios.post(
            `${BASE_URL}/auth/refresh`,
            {},
            {
              headers: {
                'Content-Type': 'application/json',
              },
              withCredentials: true,
            }
          );

          const newToken = refreshResponse.data.token;
          localStorage.setItem('token', newToken);

          tokenQueue.setRefreshing(false);
          config.headers['Authorization'] = `Bearer ${newToken}`;
          tokenQueue.processQueue(newToken);

          // 원래 요청 재시도
          return axios(config);
        } else {
          // 다른 요청이 이미 토큰을 갱신 중인 경우, 큐에 추가하고 대기
          const newToken = await tokenQueue.addToQueue();
          config.headers['Authorization'] = `Bearer ${newToken}`;
          return axios(config);
        }
      }
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError);
      tokenQueue.setRefreshing(false);
      tokenQueue.processQueue(null, new Error('Token refresh failed'));

      // 로그인 페이지로 리다이렉트 또는 세션 만료 처리
      // window.location.href = '/login';
    }
  }

  // 429 상태 코드 처리 (요청 한도 초과)
  if (response.status === 429) {
    return Promise.reject(new RequestLimitError('Api Request Limit'));
  }

  // 서버에서 반환한 오류 정보가 있는 경우
  if (response && response.data) {
    return Promise.reject(response.data);
  }

  return Promise.reject(error);
};

class AxiosService {
  axiosInstance: AxiosInstance;

  private debounceUserLog = debounce(
    (logs: any[]) => {
      // 누적된 로그들을 한번에 전송
      // sendUserLog('request', null, { requests: logs });
      // this.logQueue = [];
    },
    1000,
    { maxWait: 2000 }
  );

  private logQueue: any[] = [];

  // 로그를 누적시키고 누적된 로그를 한번에 보낼 수 있도록
  private queueUserLog(dataLog: any) {
    this.logQueue.push(dataLog);
    this.debounceUserLog([...this.logQueue]);
  }

  constructor() {
    this.axiosInstance = AxiosBaseInstance;
    this.setupInterceptors();
  }

  setupInterceptors() {
    this.axiosInstance.interceptors.request.use(handleRequest, handleRequestError);
    this.axiosInstance.interceptors.response.use(handleResponseSuccess, handleResponseError);
  }

  async handleError(
    error: unknown,
    method: TApiMethod,
    url: string,
    data: any,
    retryCount: number
  ): Promise<any> {
    if (error instanceof RequestLimitError) {
      if (MAX_RETCNT <= retryCount) return error;
      // 로스트아크 api의 경우 1분에 100건의 요청만 허용함. 그래서 요청을 많이 날린 경우 1분 정도 뒤에 재요청
      await hold(RPS);
      const res = await this.request({
        method,
        url,
        data,
        retryCount: retryCount + 1,
      });

      return res;
    }

    return error;
  }

  async request<T>(requestParam: IRequestParam): Promise<IApiResponseTemplate<T>> {
    const {
      method = 'get',
      url,
      data,
      retryCount = 0,
      headers,
      responseType,
      showLoading = true,
    } = requestParam;

    try {
      if (url !== '/api/loadoCommon/userlog') {
        const requestData = {
          method,
          url,
        };
        const userRequestDataLog = _.merge(
          requestData,
          data ? { data: JSON.stringify(data).substring(0, 100) } : {}
        );

        // this.queueUserLog(userRequestDataLog);
      }

      // 로딩 상태 표시 로직
      if (showLoading) {
        // loadingStore.show();
      }

      // responseType이 추가된 요청 옵션
      const requestOptions: any = {
        headers,
        responseType,
        showLoading,
      };

      let res;
      switch (method) {
        case 'get':
          res = await this.axiosInstance.get(url, requestOptions);
          break;
        case 'post':
          res = await this.axiosInstance.post(url, data, requestOptions);
          break;
        case 'put':
          res = await this.axiosInstance.put(url, data, requestOptions);
          break;
        case 'delete':
          res = await this.axiosInstance.delete(url, requestOptions);
          break;
        default:
          res = await this.axiosInstance.get(url, requestOptions);
      }

      // 로딩 상태 숨김
      if (showLoading) {
        // loadingStore.hide();
      }

      return res.data;
    } catch (error) {
      // 로딩 상태 숨김
      if (showLoading) {
        // loadingStore.hide();
      }
      return this.handleError(error, method, url, data, retryCount);
    }
  }

  public get<T = unknown>(
    url: string,
    params?: Record<string, any>,
    headers?: Record<string, string>,
    options?: {
      responseType?: ResponseType;
      showLoading?: boolean;
    }
  ): Promise<IApiResponseTemplate<T>> {
    let urlWithParams = url;

    try {
      const paramDataStringified = queryString.stringify(params ?? {});
      urlWithParams = paramDataStringified
        ? `${urlWithParams}?${paramDataStringified}`
        : urlWithParams;

      return this.request({
        url: urlWithParams,
        headers: headers ?? {
          Accept: 'application/json',
        },
        responseType: options?.responseType,
        showLoading: options?.showLoading,
      });
    } catch (error) {
      console.error('Error in get request:', error);
      return this.request({
        url,
        headers: headers ?? {
          Accept: 'application/json',
        },
        responseType: options?.responseType,
        showLoading: options?.showLoading,
      });
    }
  }

  public post<T = unknown>(
    url: string,
    data?: Record<string, any>,
    headers?: Record<string, string>,
    options?: {
      responseType?: ResponseType;
      showLoading?: boolean;
    }
  ): Promise<IApiResponseTemplate<T>> {
    return this.request({
      url,
      data,
      method: 'post',
      headers: headers ?? {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      responseType: options?.responseType,
      showLoading: options?.showLoading,
    });
  }

  public put<T = unknown>(
    url: string,
    data?: Record<string, any>,
    headers?: Record<string, string>,
    options?: {
      responseType?: ResponseType;
      showLoading?: boolean;
    }
  ): Promise<IApiResponseTemplate<T>> {
    return this.request({
      url,
      data,
      method: 'put',
      headers: headers ?? {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      responseType: options?.responseType,
      showLoading: options?.showLoading,
    });
  }

  public delete<T = unknown>(
    url: string,
    headers?: Record<string, string>,
    options?: {
      responseType?: ResponseType;
      showLoading?: boolean;
    }
  ): Promise<IApiResponseTemplate<T>> {
    return this.request({
      url,
      method: 'delete',
      headers: headers ?? {
        Accept: 'application/json',
      },
      responseType: options?.responseType,
      showLoading: options?.showLoading,
    });
  }

  // 파일 다운로드 전용 메서드 추가
  public downloadFile<T = unknown>(
    url: string,
    params?: Record<string, any>,
    fileName?: string
  ): Promise<IApiResponseTemplate<T>> {
    return this.get(
      url,
      params,
      {
        Accept: 'application/octet-stream',
      },
      {
        responseType: 'blob' as ResponseType,
        showLoading: true,
      }
    );
  }
}

const httpService = new AxiosService();

export default httpService;
