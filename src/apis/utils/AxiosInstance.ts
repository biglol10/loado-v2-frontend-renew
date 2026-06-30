import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import queryString from 'query-string';
import RequestLimitError from './RequestLimitError';
import { hold } from '@/utils/utilityFunctions';
import { IApiResponseTemplate } from './types';

export type TApiMethod = 'get' | 'post' | 'put' | 'delete';

interface IRequestParam {
  method?: TApiMethod;
  url: string;
  data?: unknown;
  headers?: Record<string, string>;
  retryCount?: number;
  signal?: AbortSignal;
}

// 로스트아크 API는 1분에 100건으로 제한되므로, 429 발생 시 약 1분 후 재시도한다.
const RETRY_DELAY_MS = 60 * 1000;
const MAX_RETRY_COUNT = 2;

const BASE_URL = process.env.NODE_ENV === 'development' ? '' : process.env.REACT_APP_BASE_URL;

const BASE_PREFIX = '/lostark';
const LOSTARK_API_MARKET = `${BASE_PREFIX}/markets/items`;
const LOSTARK_API_AUCTION = `${BASE_PREFIX}/auctions/items`;
const LOSTARK_API_ENDPOINTS = [LOSTARK_API_MARKET, LOSTARK_API_AUCTION];

const AxiosBaseInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 30000,
});

const handleRequest = (config: InternalAxiosRequestConfig<unknown>) => {
  const { url = '', headers } = config;
  const token = process.env.REACT_APP_SMILEGATE_TOKEN;

  // Frontend-only deployment: this token is exposed in the browser bundle.
  // Move this to a server/BFF/proxy before treating the app as production-safe.
  if (token && LOSTARK_API_ENDPOINTS.some((endpoint) => url.endsWith(endpoint))) {
    Object.assign(headers, {
      Authorization: `Bearer ${token}`,
    });
  }

  return config;
};

const handleRequestError = (error: unknown) => {
  return Promise.reject(error);
};

const handleResponseSuccess = (response: AxiosResponse<unknown, unknown>) => {
  if (response.status === 429) {
    return Promise.reject(new RequestLimitError('Api Request Limit'));
  }

  return response;
};

const handleResponseError = (error: unknown) => {
  if (axios.isCancel(error)) {
    return Promise.reject(error);
  }

  // ! 로스트아크 api에 너무 많은 요청을 보내면 여기로 옴 (handleResponseSuccess가 아님)
  if (axios.isAxiosError(error) && error.response?.status === 429) {
    return Promise.reject(new RequestLimitError('Api Request Limit'));
  }

  return Promise.reject(error);
};

class AxiosService {
  axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = AxiosBaseInstance;

    this.setupInterceptors();
  }

  setupInterceptors() {
    this.axiosInstance.interceptors.request.use(handleRequest, handleRequestError);

    this.axiosInstance.interceptors.response.use(handleResponseSuccess, handleResponseError);
  }

  private async handleError<T>(
    error: unknown,
    method: TApiMethod,
    url: string,
    data: unknown,
    retryCount: number,
    signal?: AbortSignal
  ): Promise<IApiResponseTemplate<T>> {
    if (error instanceof RequestLimitError && retryCount < MAX_RETRY_COUNT) {
      await hold(RETRY_DELAY_MS);
      return this.request<T>({
        method,
        url,
        data,
        retryCount: retryCount + 1,
        signal,
      });
    }

    // 처리하지 못한 에러는 반드시 다시 throw 해야 react-query의 isError / onError가 동작한다.
    throw error;
  }

  async request<T>(requestParam: IRequestParam): Promise<IApiResponseTemplate<T>> {
    const { method = 'get', url, data, retryCount = 0, headers, signal } = requestParam;

    try {
      const config = { headers, signal };

      // get/delete는 (url, config), post/put은 (url, data, config) 시그니처를 사용한다.
      const res =
        method === 'get' || method === 'delete'
          ? await this.axiosInstance[method]<IApiResponseTemplate<T>>(url, config)
          : await this.axiosInstance[method]<IApiResponseTemplate<T>>(url, data, config);

      return res.data;
    } catch (error) {
      return this.handleError<T>(error, method, url, data, retryCount, signal);
    }
  }

  public get<T = unknown>(
    url: string,
    params?: Record<string, unknown>,
    headers?: Record<string, string>,
    signal?: AbortSignal
  ): Promise<IApiResponseTemplate<T>> {
    let urlWithParams = url;

    try {
      const paramDataStringified = queryString.stringify(params ?? {}); // queryString.stringify({}) is ''
      if (paramDataStringified) {
        urlWithParams = `${urlWithParams}?${paramDataStringified}`;
      }
    } catch {
      urlWithParams = url;
    }

    return this.request({
      url: urlWithParams,
      headers: headers ?? { Accept: 'application/json' },
      signal,
    });
  }

  public post<T = unknown>(
    url: string,
    data?: Record<string, unknown>,
    headers?: Record<string, string>,
    signal?: AbortSignal
  ): Promise<IApiResponseTemplate<T>> {
    return this.request({
      url,
      data,
      method: 'post',
      headers: headers ?? {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      signal,
    });
  }

  public put<T = unknown>(
    url: string,
    data?: Record<string, unknown>,
    headers?: Record<string, string>,
    signal?: AbortSignal
  ): Promise<IApiResponseTemplate<T>> {
    return this.request({
      url,
      data,
      method: 'put',
      headers: headers ?? {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      signal,
    });
  }

  public delete<T = unknown>(
    url: string,
    headers?: Record<string, string>,
    signal?: AbortSignal
  ): Promise<IApiResponseTemplate<T>> {
    return this.request({
      url,
      method: 'delete',
      headers: headers ?? {
        Accept: 'application/json',
      },
      signal,
    });
  }
}

const httpService = new AxiosService();

export default httpService;
