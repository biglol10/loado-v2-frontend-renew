import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import RuqestLimitError from './RequestLimitError';
import queryString from 'query-string';
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
};
