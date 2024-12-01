import { AxiosResponse } from 'axios';

export interface IApiResponseTemplate<T> {
  result: 'success' | string;
  data: T;
}

export type TApiResponse<T = any> = AxiosResponse<IApiResponseTemplate<T>>;
