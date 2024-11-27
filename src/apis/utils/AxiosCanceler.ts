import axios, { CancelTokenSource } from 'axios';
import { TApiMethod } from './AxiosInstance';
import _ from 'lodash';

interface ICancelerParams {
  url: string;
  data?: object;
  method: TApiMethod;
}

class AxiosCanceler {
  private cancelTokens: Map<string, CancelTokenSource>;

  constructor() {
    this.cancelTokens = new Map();
  }

  getCancelToken({
    url,
    data,
    method = 'get',
  }: ICancelerParams): CancelTokenSource | undefined {
    const key = this.generateKey({
      url,
      data,
      method,
    });

    if (this.cancelTokens.has(key)) {
      return this.cancelTokens.get(key)!;
    }

    return undefined;
  }

  // 요청에 대한 CancelToken을 생성하고 저장
  addRequest({ url, data, method = 'get' }: ICancelerParams): void {
    // 고유 키 생성
    const key = this.generateKey({ url, data, method });

    // 이전 요청이 있는 경우 취소
    if (this.cancelTokens.has(key)) {
      this.cancelTokens
        .get(key)!
        .cancel('Previous request canceled due to new request ', {
          url,
          data,
          method,
        });
    }

    // 새로운 CancelToken 생성
    const source = axios.CancelToken.source();
    this.cancelTokens.set(key, source);
  }

  // 요청이 완료되면 해당 CancelToken 삭제
  removeRequest({ url, data, method = 'get' }: ICancelerParams): void {
    const key = this.generateKey({ url, data, method });
    this.cancelTokens.delete(key);
  }

  // 모든 요청 취소
  cancelAll(): void {
    this.cancelTokens.forEach((source) => {
      source.cancel('All requests canceled');
    });
    this.cancelTokens.clear();
  }

  // 고유 키 생성 함수
  private generateKey({ url, data, method }: ICancelerParams): string {
    // 본문 데이터를 정렬하여 일관된 키 생성
    const sortedData = _.omit(data || {}, ['undefined', 'null']);
    return `${method}&${url}&${JSON.stringify(_.sortBy(Object.entries(sortedData)))}`;

    // const url = 'https://api.example.com/data';
    // const data1 = { key: 'value', filter: 'active' };
    // const data2 = { filter: 'active', key: 'value' };
    // const key1 = post&https://api.example.com/data&[["filter","active"],["key","value"]]
    // const key2 = post&https://api.example.com/data&[["filter","active"],["key","value"]]\

    // 처럼 data object의 순서가 달라도 일관된 키 생성
  }
}

const axiosCanceler = new AxiosCanceler();

export default axiosCanceler;
