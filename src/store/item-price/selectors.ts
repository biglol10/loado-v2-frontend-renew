import { ItemPriceState } from './types';
import { selectProperty, asyncSelectors, selectDerived } from '../core';
import { ItemData, ItemCategoryCode } from '../../apis/itemPrice-v2';

/**
 * 아이템 가격 스토어 선택자
 *
 * 이 파일은 아이템 가격 스토어의 상태를 선택하고 변환하는 선택자 함수들을 제공합니다.
 *
 * 이점:
 * 1. 성능 최적화: 필요한 데이터만 선택하여 불필요한 렌더링 방지
 * 2. 관심사 분리: 상태 선택 로직과 UI 로직 분리
 * 3. 재사용성: 여러 컴포넌트에서 동일한 상태 선택 로직 재사용
 * 4. 파생 데이터: 원본 상태에서 계산된 값 쉽게 생성
 */

/**
 * 기본 선택자
 */
export const selectLoading = selectProperty<ItemPriceState, 'loading'>('loading');
export const selectError = selectProperty<ItemPriceState, 'error'>('error');
export const selectFilter = selectProperty<ItemPriceState, 'filter'>('filter');
export const selectData = selectProperty<ItemPriceState, 'data'>('data');

/**
 * 비동기 상태 선택자
 */
export const selectFetchLoading = asyncSelectors.isLoading<ItemPriceState, 'fetchStatus'>(
  'fetchStatus'
);
export const selectFetchSuccess = asyncSelectors.isSuccess<ItemPriceState, 'fetchStatus'>(
  'fetchStatus'
);
export const selectFetchError = asyncSelectors.isError<ItemPriceState, 'fetchStatus'>(
  'fetchStatus'
);
export const selectFetchData = asyncSelectors.getData<ItemPriceState, 'fetchStatus', ItemData[]>(
  'fetchStatus'
);
export const selectFetchErrorMessage = asyncSelectors.getError<
  ItemPriceState,
  'fetchStatus',
  string
>('fetchStatus');

/**
 * 데이터 선택자
 */
export const selectItemsByCategory = (state: ItemPriceState) => state.data.itemsByCategory;
export const selectFavoriteItems = (state: ItemPriceState) => state.data.favoriteItems;
export const selectRecentItems = (state: ItemPriceState) => state.data.recentItems;

/**
 * 특정 카테고리의 아이템 선택자
 *
 * @param categoryCode 카테고리 코드
 * @returns 해당 카테고리의 아이템 목록
 */
export const selectItemsByCategoryCode =
  (categoryCode: ItemCategoryCode) => (state: ItemPriceState) =>
    state.data.itemsByCategory[categoryCode] || [];

/**
 * 필터링된 아이템 선택자
 * 현재 필터 설정에 따라 아이템 필터링 및 정렬
 */
export const selectFilteredItems = selectDerived<ItemPriceState, ItemData[]>((state) => {
  const { filter, data } = state;

  // 선택된 카테고리의 모든 아이템 합치기
  let items: ItemData[] = [];
  filter.categories.forEach((category) => {
    const categoryItems = data.itemsByCategory[category] || [];
    items = [...items, ...categoryItems];
  });

  // 검색어 필터링 (있는 경우)
  if (filter.searchKeyword && filter.searchKeyword.trim() !== '') {
    const keyword = filter.searchKeyword.toLowerCase();
    items = items.filter((item) => item.name.toLowerCase().includes(keyword));
  }

  // 가격 범위 필터링 (있는 경우)
  if (typeof filter.minPrice === 'number') {
    items = items.filter((item) => item.avgPrice >= (filter.minPrice || 0));
  }

  if (typeof filter.maxPrice === 'number') {
    items = items.filter((item) => item.avgPrice <= (filter.maxPrice || Infinity));
  }

  // 정렬
  return items.sort((a, b) => {
    const isAsc = filter.sortOrder === 'asc';
    const sortKey = filter.sortBy;

    if (sortKey === 'name') {
      return isAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    }

    // 숫자 값으로 정렬
    const aValue = sortKey === 'price' ? a['avgPrice'] : a[sortKey as keyof ItemData];
    const bValue = sortKey === 'price' ? b['avgPrice'] : b[sortKey as keyof ItemData];

    return isAsc
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });
});

/**
 * 즐겨찾기 아이템 배열 선택자
 * 객체 형태의 즐겨찾기를 배열로 변환
 */
export const selectFavoriteItemsArray = selectDerived<ItemPriceState, ItemData[]>((state) => {
  return Object.values(state.data.favoriteItems);
});

/**
 * 아이템이 즐겨찾기인지 확인하는 선택자 생성 함수
 *
 * @param itemId 확인할 아이템 ID
 * @returns 즐겨찾기 여부
 */
export const selectIsFavorite = (itemId: string) => (state: ItemPriceState) =>
  !!state.data.favoriteItems[itemId];

/**
 * 마지막 업데이트 시간 선택자
 */
export const selectLastUpdated = (state: ItemPriceState) => state.fetchStatus.lastUpdated;
