import { apiClient } from '../core/ApiClient';
import { ApiResponse } from '../core/types';
import {
  ItemData,
  ItemPriceQueryParams,
  SingleItemPriceQueryParams,
  ItemPriceTimeSeries,
} from './types';

/**
 * 아이템 가격 API 모듈
 *
 * 이 모듈은 아이템 가격 정보 관련 API 호출 함수들을 제공합니다.
 *
 * 이점:
 * 1. 관심사 분리: API 호출 로직을 UI 컴포넌트와 분리
 * 2. 재사용성: 다양한 컴포넌트에서 동일한 API 호출 함수 재사용
 * 3. 일관성: 모든 API 호출이 동일한 구조와 에러 처리 방식을 사용
 * 4. 유지보수성: API 엔드포인트 변경 시 한 곳만 수정하면 됨
 */

/**
 * 아이템 가격 정보 모듈의 기본 API 경로
 */
const BASE_PATH = '/api/loadoPrice';

/**
 * 카테고리별 아이템 가격 목록 조회
 *
 * @param params 조회 파라미터
 * @returns 아이템 가격 데이터 배열
 */
export async function fetchItemPricesByCategory(
  params: ItemPriceQueryParams
): Promise<ApiResponse<ItemData[]>> {
  return apiClient.get<ApiResponse<ItemData[]>>(
    `${BASE_PATH}/getMarketPriceByCategoryCode`,
    params
  );
}

/**
 * 단일 아이템의 가격 정보 조회
 *
 * @param params 조회 파라미터
 * @returns 단일 아이템 가격 데이터
 */
export async function fetchSingleItemPrice(
  params: SingleItemPriceQueryParams
): Promise<ApiResponse<ItemData>> {
  return apiClient.get<ApiResponse<ItemData>>(`${BASE_PATH}/getItemPrice/${params.itemId}`, {
    timeRange: params.timeRange || 'day',
  });
}

/**
 * 단일 아이템의 가격 시계열 정보 조회
 *
 * @param itemId 아이템 ID
 * @param timeRange 시간 범위 (기본값: 'month')
 * @returns 아이템 가격 시계열 데이터
 */
export async function fetchItemPriceHistory(
  itemId: string,
  timeRange: 'day' | 'week' | 'month' | 'year' = 'month'
): Promise<ApiResponse<ItemPriceTimeSeries[]>> {
  return apiClient.get<ApiResponse<ItemPriceTimeSeries[]>>(
    `${BASE_PATH}/getItemPriceHistory/${itemId}`,
    { timeRange }
  );
}

/**
 * 여러 아이템의 가격 정보 일괄 조회
 *
 * @param itemIds 아이템 ID 배열
 * @param timeValue 검색 날짜 (YYYY-MM-DD 형식)
 * @returns 아이템 가격 데이터 배열
 */
export async function fetchMultipleItemPrices(
  itemIds: string[],
  timeValue: string
): Promise<ApiResponse<ItemData[]>> {
  return apiClient.post<ApiResponse<ItemData[]>>(`${BASE_PATH}/getBulkItemPrices`, {
    itemIds,
    timeValue,
  });
}

/**
 * 아이템 가격 검색
 *
 * @param keyword 검색 키워드
 * @param categoryCode 선택적 카테고리 코드
 * @param timeValue 검색 날짜 (YYYY-MM-DD 형식)
 * @returns 검색 결과 아이템 가격 데이터 배열
 */
export async function searchItemPrices(
  keyword: string,
  categoryCode?: string,
  timeValue?: string
): Promise<ApiResponse<ItemData[]>> {
  return apiClient.get<ApiResponse<ItemData[]>>(`${BASE_PATH}/searchItems`, {
    keyword,
    categoryCode,
    timeValue: timeValue || new Date().toISOString().split('T')[0],
  });
}
