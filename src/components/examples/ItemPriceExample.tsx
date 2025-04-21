import React, { useEffect, useState } from 'react';
import { useMultiCategoryItemPrices, ITEM_CATEGORIES } from '../../apis/itemPrice-v2';
import {
  useItemPriceStore,
  selectFilteredItems,
  selectLoading,
  selectError,
} from '../../store/item-price';

/**
 * 아이템 가격 예제 컴포넌트
 *
 * 이 컴포넌트는 개선된 API 레이어와 상태 관리 시스템을 활용하는 방법을 보여줍니다.
 *
 * 이점:
 * 1. 관심사 분리: API 호출과 상태 관리가 UI 로직과 분리됨
 * 2. 선언적 코드: 복잡한 상태 관리 로직 대신 간결한 훅 사용
 * 3. 재사용성: 다양한 컴포넌트에서 동일한 데이터와 로직 재사용 가능
 * 4. 성능 최적화: 불필요한 렌더링이 방지됨
 */
const ItemPriceExample: React.FC = () => {
  const [searchDate, setSearchDate] = useState(new Date().toISOString().split('T')[0]);

  // React Query 훅 사용
  const {
    data,
    isLoading: queryLoading,
    isError: queryError,
    refetch,
  } = useMultiCategoryItemPrices(searchDate, [
    ITEM_CATEGORIES.BATTLE_ITEM,
    ITEM_CATEGORIES.ENGRAVING,
  ]);

  // Zustand 스토어 훅 사용
  const itemPriceStore = useItemPriceStore();
  const { fetchItemPrices, addFavorite, removeFavorite, setFilter } = itemPriceStore;

  // 선택자를 통한 상태 접근
  const filteredItems = useItemPriceStore(selectFilteredItems);
  const loading = useItemPriceStore(selectLoading);
  const error = useItemPriceStore(selectError);

  // 날짜 변경 핸들러
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchDate(e.target.value);
  };

  // 즐겨찾기 토글 핸들러
  const toggleFavorite = (item: any) => {
    const isFavorite = useItemPriceStore.getState().data.favoriteItems[item.id];
    if (isFavorite) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
  };

  // 정렬 변경 핸들러
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const [sortBy, sortOrder] = value.split('-');
    setFilter({
      sortBy: sortBy as any,
      sortOrder: sortOrder as 'asc' | 'desc',
    });
  };

  // 검색 필터 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({
      searchKeyword: e.target.value,
    });
  };

  // 초기 데이터 로드
  useEffect(() => {
    // React Query 사용 방식
    refetch();

    // Zustand 스토어 사용 방식
    fetchItemPrices(searchDate);
  }, [searchDate, refetch, fetchItemPrices]);

  return (
    <div className="item-price-example">
      <h1>아이템 가격 예제</h1>

      <div className="controls">
        <div className="date-selector">
          <label>날짜 선택:</label>
          <input type="date" value={searchDate} onChange={handleDateChange} />
        </div>

        <div className="sort-selector">
          <label>정렬:</label>
          <select onChange={handleSortChange}>
            <option value="name-asc">이름 (오름차순)</option>
            <option value="name-desc">이름 (내림차순)</option>
            <option value="avgPrice-asc">가격 (오름차순)</option>
            <option value="avgPrice-desc">가격 (내림차순)</option>
            <option value="tradeCount-desc">거래량 (내림차순)</option>
          </select>
        </div>

        <div className="search-filter">
          <label>검색:</label>
          <input type="text" placeholder="아이템 이름 검색..." onChange={handleSearchChange} />
        </div>
      </div>

      {/* 로딩 및 에러 처리 */}
      {(loading || queryLoading) && <div className="loading">로딩 중...</div>}
      {(error || queryError) && <div className="error">에러가 발생했습니다.</div>}

      {/* React Query로 로드한 데이터 표시 */}
      <div className="data-section">
        <h2>React Query로 로드한 데이터</h2>
        <div className="item-grid">
          {data
            ?.flat()
            .slice(0, 10)
            .map((item: any) => (
              <div key={item.id} className="item-card">
                <img src={item.icon} alt={item.name} />
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p>평균 가격: {item.avgPrice.toLocaleString()}골드</p>
                  <p>최저가: {item.currentMinPrice.toLocaleString()}골드</p>
                  <p>거래량: {item.tradeCount.toLocaleString()}</p>
                </div>
                <button onClick={() => toggleFavorite(item)}>
                  {useItemPriceStore.getState().data.favoriteItems[item.id] ? '★' : '☆'}
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Zustand 스토어로 관리되는 필터링된 데이터 표시 */}
      <div className="data-section">
        <h2>Zustand로 관리되는 필터링된 데이터</h2>
        <div className="item-grid">
          {filteredItems.slice(0, 10).map((item) => (
            <div key={item.id} className="item-card">
              <img src={item.icon} alt={item.name} />
              <div className="item-info">
                <h3>{item.name}</h3>
                <p>평균 가격: {item.avgPrice.toLocaleString()}골드</p>
                <p>최저가: {item.currentMinPrice.toLocaleString()}골드</p>
                <p>거래량: {item.tradeCount.toLocaleString()}</p>
              </div>
              <button onClick={() => toggleFavorite(item)}>
                {useItemPriceStore.getState().data.favoriteItems[item.id] ? '★' : '☆'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemPriceExample;
