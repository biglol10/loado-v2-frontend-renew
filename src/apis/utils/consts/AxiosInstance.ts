import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import queryString from 'query-string';
import RequestLimitError from '../RequestLimitError';
import _ from 'lodash';

interface IRequestParam {
  method?: 'get' | 'post' | 'put' | 'delete';
  url: string;
  data?: any;
  retryCount?: number;
}

const BASE_URL =
  process.env.NODE_ENV === 'development' ? '' : process.env.REACT_APP_BASE_URL;

const BASE_PREFIX = '/lostark';

const LOSTARK_API_MARKET = `${BASE_PREFIX}/markets/items`;
const LOSTARK_API_AUCTION = `${BASE_PREFIX}/auctions/items`;

const AxiosBaseInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 30000,
});

const handleRequest = (config: InternalAxiosRequestConfig<any>) => {
  if (
    config.url?.endsWith(LOSTARK_API_MARKET) ||
    config.url?.endsWith(LOSTARK_API_AUCTION)
  ) {
    Object.assign(config.headers, {
      Authorization: `bearer ${process.env.SIMEGATE_TOKEN}`,
    });
  }

  return config;
};

const handleRequestError = (error: any) => {
  return Promise.reject(error);
};

const handleResponseSuccess = (response: AxiosResponse<any, any>) => {
  if (response.status === 200) {
    return response.data;
  } else if (response.status === 429) {
    return Promise.reject(new RequestLimitError('Api Request Limit'));
  }

  return response;
};

const handleResponseError = (error: any) => {
  console.error('error in handleResponseError in handleResponseError');

  const { response } = error;

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

  constructor() {
    this.axiosInstance = AxiosBaseInstance;

    this.setupInterceptors();
  }

  setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      handleRequest,
      handleRequestError
    );

    this.axiosInstance.interceptors.response.use(
      handleResponseSuccess,
      handleResponseError
    );
  }

  request(requestParam: IRequestParam) {
    const { method = 'get', url, data, retryCount = 0 } = requestParam;

    try {
      if (url !== '/api/loadoCommon/userlog') {
        try {
          const requestData = {
            method,
            url,
          };
          const userRequestDataLog = _.merge(requestData);
        } catch {}
      }
    } catch {}
  }

  public get<T>(
    url: string,
    params?: Record<string, any>
  ): Promise<AxiosResponse<T, any>> {
    let urlWithParams = url;

    try {
      const paramDataStringified = queryString.stringify(params ?? {}); // queryString.stringify({}) is ''
      urlWithParams = `${urlWithParams}?${paramDataStringified}`;

      return this.axiosInstance.request({
        url: urlWithParams,
      });
    } catch {
      return this.axiosInstance.request({
        url,
      });
    }
  }
}

const http = new AxiosService();

export default http;
