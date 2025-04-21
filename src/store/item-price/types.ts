import { AsyncState, CommonState } from '../core';
import { ItemData, ItemCategoryCode, ITEM_CATEGORIES } from '../../apis/itemPrice-v2';

/**
 * 아이템 가격 스토어 타입 정의
 *
 * 이 파일은 아이템 가격 스토어에 사용되는 타입 정의를 제공합니다.
 *
 * 이점:
 * 1. 타입 안전성: 명확한 타입 정의로 런타임 오류 감소
 * 2. 코드 가독성: 구조화된 인터페이스로 상태 구조 이해 용이
 * 3. 컴포넌트 통합: 컴포넌트와 스토어 간의 타입 일관성 보장
 */

/**
 * 아이템 가격 필터 인터페이스
 */
export interface ItemPriceFilter {
  searchDate: string; // 검색 날짜 (YYYY-MM-DD 형식)
  categories: ItemCategoryCode[]; // 선택한 카테고리 코드 배열
  searchKeyword?: string; // 검색 키워드 (선택 사항)
  minPrice?: number; // 최소 가격 (선택 사항)
  maxPrice?: number; // 최대 가격 (선택 사항)
  sortBy: 'name' | 'price' | 'avgPrice' | 'tradeCount'; // 정렬 기준
  sortOrder: 'asc' | 'desc'; // 정렬 방향
}

/**
 * 아이템 가격 데이터 상태 인터페이스
 */
export interface ItemPriceData {
  itemsByCategory: Record<ItemCategoryCode, ItemData[]>; // 카테고리별 아이템 데이터
  favoriteItems: Record<string, ItemData>; // 즐겨찾기 아이템 (ID -> 데이터)
  recentItems: ItemData[]; // 최근 조회 아이템 목록
}

/**
 * 아이템 가격 상태 인터페이스
 */
export interface ItemPriceState extends CommonState {
  // 데이터 상태
  data: ItemPriceData;

  // 필터 상태
  filter: ItemPriceFilter;

  // 비동기 작업 상태
  fetchStatus: AsyncState<ItemData[]>;

  // 액션 (setter)
  setFilter: (filter: Partial<ItemPriceFilter>) => void;
  resetFilter: () => void;

  // 데이터 액션
  addFavorite: (item: ItemData) => void;
  removeFavorite: (itemId: string) => void;
  clearFavorites: () => void;
  addRecentItem: (item: ItemData) => void;
  clearRecentItems: () => void;
  updateItemsByCategory: (categoryCode: ItemCategoryCode, items: ItemData[]) => void;

  // 비동기 액션
  fetchItemPrices: (date?: string, categories?: ItemCategoryCode[]) => Promise<void>;
  searchItems: (keyword: string) => Promise<ItemData[]>;
}

/**
 * 기본 필터 값
 */
export const DEFAULT_FILTER: ItemPriceFilter = {
  searchDate: new Date().toISOString().split('T')[0], // 오늘 날짜
  categories: ['44410', '50010', '50020', '51100', '210000'] as ItemCategoryCode[],
  sortBy: 'avgPrice',
  sortOrder: 'desc',
};
