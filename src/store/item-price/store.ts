import { createStore, handleAsync } from '../core';
import { ItemPriceState, ItemPriceData, DEFAULT_FILTER } from './types';
import {
  ItemData,
  ItemCategoryCode,
  fetchItemPricesByCategory,
  searchItemPrices,
  ITEM_CATEGORIES,
} from '../../apis/itemPrice-v2';

/**
 * 아이템 가격 스토어
 *
 * 이 파일은 아이템 가격 정보를 관리하는 Zustand 스토어를 구현합니다.
 *
 * 이점:
 * 1. 중앙화된 상태 관리: 모든 아이템 가격 관련 상태를 단일 스토어에서 관리
 * 2. 비즈니스 로직 분리: UI에서 독립적인 상태 관리 로직
 * 3. 재사용성: 여러 컴포넌트에서 동일한 상태 공유
 * 4. 일관성: 상태 변경에 대한 일관된 패턴 제공
 */

// 초기 데이터 상태
const initialData: ItemPriceData = {
  itemsByCategory: Object.values(ITEM_CATEGORIES).reduce(
    (acc, category) => {
      acc[category as ItemCategoryCode] = [];
      return acc;
    },
    {} as Record<ItemCategoryCode, ItemData[]>
  ),
  favoriteItems: {},
  recentItems: [],
};

/**
 * 아이템 가격 스토어 생성
 */
export const useItemPriceStore = createStore<ItemPriceState>(
  (set, get) => ({
    // 기본 상태
    loading: false,
    error: null,
    data: initialData,
    filter: DEFAULT_FILTER,

    // 비동기 상태
    fetchStatus: {
      status: 'idle',
      data: null,
      error: null,
      lastUpdated: null,
    },

    /**
     * 필터 업데이트
     *
     * @param filter 업데이트할 필터 객체
     */
    setFilter: (filter) => {
      set((state) => {
        state.filter = { ...state.filter, ...filter };
      });
    },

    /**
     * 필터 초기화
     */
    resetFilter: () => {
      set((state) => {
        state.filter = DEFAULT_FILTER;
      });
    },

    /**
     * 즐겨찾기 아이템 추가
     *
     * @param item 즐겨찾기에 추가할 아이템
     */
    addFavorite: (item) => {
      set((state) => {
        state.data.favoriteItems[item.id] = item;
      });
    },

    /**
     * 즐겨찾기 아이템 제거
     *
     * @param itemId 제거할 아이템 ID
     */
    removeFavorite: (itemId) => {
      set((state) => {
        const { [itemId]: removed, ...rest } = state.data.favoriteItems;
        state.data.favoriteItems = rest;
      });
    },

    /**
     * 모든 즐겨찾기 아이템 제거
     */
    clearFavorites: () => {
      set((state) => {
        state.data.favoriteItems = {};
      });
    },

    /**
     * 최근 조회 아이템 추가
     *
     * @param item 추가할 아이템
     */
    addRecentItem: (item) => {
      set((state) => {
        // 이미 존재하는 아이템 제거
        const filteredItems = state.data.recentItems.filter((i: any) => i.id !== item.id);
        // 최근 아이템 목록 앞에 새 아이템 추가 (최대 10개까지만 유지)
        state.data.recentItems = [item, ...filteredItems].slice(0, 10);
      });
    },

    /**
     * 최근 조회 아이템 목록 초기화
     */
    clearRecentItems: () => {
      set((state) => {
        state.data.recentItems = [];
      });
    },

    /**
     * 카테고리별 아이템 목록 업데이트
     *
     * @param categoryCode 카테고리 코드
     * @param items 업데이트할 아이템 목록
     */
    updateItemsByCategory: (categoryCode, items) => {
      set((state) => {
        state.data.itemsByCategory[categoryCode] = items;
      });
    },

    /**
     * 아이템 가격 정보 가져오기
     *
     * @param date 검색 날짜 (기본값: 현재 필터의 날짜)
     * @param categories 검색할 카테고리 (기본값: 현재 필터의 카테고리)
     */
    fetchItemPrices: async (date, categories): Promise<void> => {
      const state = get();
      const searchDate = date || state.filter.searchDate;
      const categoriesToFetch = categories || state.filter.categories;

      // 비동기 작업 상태 업데이트 및 처리
      await handleAsync<ItemPriceState, ItemData[][]>(
        set,
        'loading' as keyof ItemPriceState,
        'error' as keyof ItemPriceState,
        async () => {
          // 로딩 상태 설정
          set((state) => {
            state.fetchStatus = {
              status: 'loading',
              data: state.fetchStatus.data,
              error: null,
              lastUpdated: state.fetchStatus.lastUpdated,
            };
          });

          // 모든 카테고리 병렬 요청
          const promises = categoriesToFetch.map((categoryCode) =>
            fetchItemPricesByCategory({
              categoryCode,
              timeValue: searchDate,
            })
          );

          const responses = await Promise.all(promises);
          return responses.map((response, index) => {
            const categoryCode = categoriesToFetch[index];
            const items = response.data;

            // 각 카테고리별 결과 상태 업데이트
            set((state) => {
              state.data.itemsByCategory[categoryCode] = items;
            });

            return items;
          });
        },
        // 성공 콜백
        (results) => {
          // 모든 결과를 하나의 배열로 평탄화
          const allItems = results.flat();

          set((state) => {
            state.fetchStatus = {
              status: 'success',
              data: allItems,
              error: null,
              lastUpdated: Date.now(),
            };
          });
        },
        // 에러 콜백
        (error) => {
          set((state) => {
            state.fetchStatus = {
              status: 'error',
              data: null,
              error: error.message,
              lastUpdated: Date.now(),
            };
          });
        }
      );
    },

    /**
     * 아이템 검색
     *
     * @param keyword 검색 키워드
     * @returns 검색 결과 아이템 목록
     */
    searchItems: async (keyword) => {
      const state = get();

      // 검색어가 비어있으면 빈 배열 반환
      if (!keyword || keyword.trim() === '') {
        return [];
      }

      // 로딩 상태 설정
      set((state) => {
        state.loading = true;
        state.error = null;
      });

      try {
        // 검색 API 호출
        const response = await searchItemPrices(
          keyword,
          undefined, // 모든 카테고리 검색
          state.filter.searchDate
        );

        // 로딩 상태 해제
        set((state) => {
          state.loading = false;
        });

        return response.data;
      } catch (error) {
        // 에러 상태 설정
        set((state) => {
          state.loading = false;
          state.error = error instanceof Error ? error.message : '검색 중 오류가 발생했습니다.';
        });

        return [];
      }
    },
  }),
  {
    name: 'item-price-store',
    persist: true, // 로컬 스토리지에 상태 유지
  }
);

export default useItemPriceStore;
