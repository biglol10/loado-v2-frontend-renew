import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
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
  retryCount?: number;
}

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

const handleRequest = (config: InternalAxiosRequestConfig<any>) => {
  const { url = '', data, headers, method } = config;

  const PROTECTED_ENDPOINTS = [LOSTARK_API_MARKET, LOSTARK_API_AUCTION];

  if (PROTECTED_ENDPOINTS.some((endpoint) => url.endsWith(endpoint))) {
    Object.assign(headers, {
      Authorization: `bearer ${process.env.SIMEGATE_TOKEN}`,
    });
  }

  try {
    const requestKey = { url, data, method: method as TApiMethod };
    axiosCanceler.addRequest(requestKey);
    config.cancelToken = axiosCanceler.getCancelToken(requestKey)?.token;
  } catch (error) {
    console.error('Error adding request to axiosCanceler:', error);
  }

  return config;
};

const handleRequestError = (error: any) => {
  return Promise.reject(error);
};

const handleResponseSuccess = (response: AxiosResponse<any, any>) => {
  const { url = '', data, method } = response.config;
  axiosCanceler.removeRequest({ url, data, method: method as TApiMethod });

  if (response.status === 429) {
    return Promise.reject(new RequestLimitError('Api Request Limit'));
  }

  return response;
};

// 잘못된 url, 잘못된 데이터, 잘못된 메서드 등 예외 처리
const handleResponseError = (error: any) => {
  console.error('error in handleResponseError in handleResponseError');

  const { response, config } = error;

  const { url = '', data, method } = config;

  axiosCanceler.removeRequest({ url, data, method: method as TApiMethod });

  if (axios.isCancel(error)) {
    console.log('API request canceled: ', error);
    return Promise.reject(error);
  } else {
    console.log('API response error: ', error);
  }

  // ! 로스트아크 api에 너무 많은 요청을 보내면 여기로 옮 (handleResponseSuccess가 아님)
  if (response.status === 429) {
    return Promise.reject(new RequestLimitError('Api Request Limit'));
  }

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
    const { method = 'get', url, data, retryCount = 0 } = requestParam;

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

      // if (!store.getState().modal.modalOpen && url !== '/api/loadoCommon/userlog') {
      //   store.dispatch(showLoader());
      // }

      const res = await this.axiosInstance[method](url, data);

      // if (url !== '/api/loadoCommon/userlog') store.dispatch(hideLoader());

      return res.data;
    } catch (error) {
      // store.dispatch(hideLoader());
      return this.handleError(error, method, url, data, retryCount);
    }
  }

  public get<T = any>(url: string, params?: Record<string, any>): Promise<IApiResponseTemplate<T>> {
    let urlWithParams = url;

    try {
      const paramDataStringified = queryString.stringify(params ?? {}); // queryString.stringify({}) is ''
      urlWithParams = `${urlWithParams}?${paramDataStringified}`;

      return this.request({
        url: urlWithParams,
      });
    } catch {
      return this.request({
        url,
      });
    }
  }

  public post<T = any>(url: string, data?: Record<string, any>): Promise<IApiResponseTemplate<T>> {
    return this.request({
      url,
      data,
      method: 'post',
    });
  }

  public put<T = any>(url: string, data?: Record<string, any>): Promise<IApiResponseTemplate<T>> {
    return this.request({
      url,
      data,
      method: 'put',
    });
  }

  public delete<T = any>(url: string): Promise<IApiResponseTemplate<T>> {
    return this.request({
      url,
      method: 'delete',
    });
  }
}

const httpService = new AxiosService();

export default httpService;
