import React, { useState, useEffect } from 'react';
import { useItemPriceStore, selectFilteredItems } from '../../store/item-price';

/**
 * 상태 관리 비교 컴포넌트
 *
 * 이 컴포넌트는 이전 방식과 개선된 상태 관리 시스템의 사용법을 비교하여 보여줍니다.
 *
 * 이점:
 * 1. 코드 간소화: 반복적인 상태 관리 코드 감소
 * 2. 선택자 패턴: 성능이 최적화된 상태 접근
 * 3. 비즈니스 로직 분리: UI에서 상태 관리 로직 분리
 * 4. 일관된 상태 업데이트: 모든 컴포넌트에서 일관된 상태 변경 패턴
 */
const StateManagementComparison: React.FC = () => {
  // ====================== 이전 방식의 상태 관리 ======================
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({
    searchKeyword: '',
    minPrice: 0,
    maxPrice: Infinity,
    sortBy: 'name',
    sortOrder: 'asc' as 'asc' | 'desc',
  });

  // 필터 변경 핸들러 (이전 방식)
  const handleOldFilterChange = (field: string, value: any) => {
    setFilter((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 필터링된 아이템 계산 (이전 방식)
  const filteredItemsOld = React.useMemo(() => {
    return items
      .filter((item) => {
        // 검색어 필터링
        if (
          filter.searchKeyword &&
          !item.name.toLowerCase().includes(filter.searchKeyword.toLowerCase())
        ) {
          return false;
        }

        // 가격 범위 필터링
        if (item.avgPrice < filter.minPrice || item.avgPrice > filter.maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // 정렬
        const isAsc = filter.sortOrder === 'asc';

        if (filter.sortBy === 'name') {
          return isAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        }

        // 숫자 값으로 정렬
        const aValue = a[filter.sortBy] as number;
        const bValue = b[filter.sortBy] as number;

        return isAsc ? aValue - bValue : bValue - aValue;
      });
  }, [items, filter]);

  // 이전 방식에서는 이런 식으로 데이터를 로드했을 것
  useEffect(() => {
    setLoading(true);
    setError(null);

    // 데이터 가져오기 시뮬레이션
    setTimeout(() => {
      try {
        // 실제로는 API 호출이 있었을 것
        const sampleItems = [
          { id: '1', name: '파괴석 결정', avgPrice: 12, currentMinPrice: 10, tradeCount: 1000 },
          { id: '2', name: '수호석 결정', avgPrice: 9, currentMinPrice: 8, tradeCount: 1200 },
          { id: '3', name: '명예의 파편', avgPrice: 1, currentMinPrice: 1, tradeCount: 5000 },
          { id: '4', name: '태양의 은총', avgPrice: 93, currentMinPrice: 91, tradeCount: 500 },
          { id: '5', name: '태양의 축복', avgPrice: 216, currentMinPrice: 210, tradeCount: 300 },
        ];

        setItems(sampleItems);
        setLoading(false);
      } catch (err) {
        setError('데이터를 로드하는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    }, 1000);
  }, []);

  // ====================== 개선된 상태 관리 사용 ======================
  // Zustand 스토어 사용
  const {
    setFilter: setZustandFilter,
    fetchItemPrices,
    addFavorite,
    removeFavorite,
  } = useItemPriceStore();

  // 선택자를 통한 상태 접근
  const filteredItemsNew = useItemPriceStore(selectFilteredItems);
  const isLoading = useItemPriceStore((state) => state.loading);
  const errorMessage = useItemPriceStore((state) => state.error);

  // 필터 변경 핸들러 (개선된 방식)
  const handleNewFilterChange = (field: string, value: any) => {
    setZustandFilter({ [field]: value });
  };

  // 즐겨찾기 토글 (개선된 방식)
  const toggleFavorite = (item: any) => {
    const store = useItemPriceStore.getState();
    const isFavorite = !!store.data.favoriteItems[item.id];

    if (isFavorite) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchItemPrices();
  }, [fetchItemPrices]);

  return (
    <div className="state-management-comparison">
      <h1>상태 관리 비교</h1>

      <div className="comparison-container">
        {/* 이전 방식 섹션 */}
        <div className="old-style">
          <h2>이전 방식 상태 관리</h2>
          <pre>
            {`
// 여러 개의 상태와 핸들러 필요
const [items, setItems] = useState<any[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [filter, setFilter] = useState({
  searchKeyword: '',
  minPrice: 0,
  maxPrice: Infinity,
  sortBy: 'name',
  sortOrder: 'asc'
});

// 필터 변경을 위한 핸들러
const handleFilterChange = (field, value) => {
  setFilter(prev => ({
    ...prev,
    [field]: value
  }));
};

// 필터링 로직을 위한 useMemo
const filteredItems = React.useMemo(() => {
  return items
    .filter(item => {
      // 복잡한 필터링 로직...
    })
    .sort((a, b) => {
      // 복잡한 정렬 로직...
    });
}, [items, filter]);
            `}
          </pre>

          <div className="status-indicators">
            <p>로딩 중: {loading ? '예' : '아니오'}</p>
            <p>에러: {error ? error : '없음'}</p>
            <p>아이템 수: {filteredItemsOld.length}</p>
          </div>

          <div className="filter-controls">
            <input
              type="text"
              placeholder="검색어"
              onChange={(e) => handleOldFilterChange('searchKeyword', e.target.value)}
            />
            <select
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                handleOldFilterChange('sortBy', sortBy);
                handleOldFilterChange('sortOrder', sortOrder as 'asc' | 'desc');
              }}
            >
              <option value="name-asc">이름 (오름차순)</option>
              <option value="name-desc">이름 (내림차순)</option>
              <option value="avgPrice-asc">가격 (오름차순)</option>
              <option value="avgPrice-desc">가격 (내림차순)</option>
            </select>
          </div>
        </div>

        {/* 개선된 방식 섹션 */}
        <div className="new-style">
          <h2>개선된 상태 관리 사용</h2>
          <pre>
            {`
// Zustand 스토어 사용
const {
  setFilter,
  fetchItemPrices,
  addFavorite,
  removeFavorite
} = useItemPriceStore();

// 선택자를 통한 상태 접근
const filteredItems = useItemPriceStore(selectFilteredItems);
const isLoading = useItemPriceStore(state => state.loading);
const errorMessage = useItemPriceStore(state => state.error);

// 간결한 핸들러
const handleFilterChange = (field, value) => {
  setFilter({ [field]: value });
};

// 직관적인 액션
const toggleFavorite = (item) => {
  const store = useItemPriceStore.getState();
  const isFavorite = !!store.data.favoriteItems[item.id];
  
  if (isFavorite) {
    removeFavorite(item.id);
  } else {
    addFavorite(item);
  }
};
            `}
          </pre>

          <div className="status-indicators">
            <p>로딩 중: {isLoading ? '예' : '아니오'}</p>
            <p>에러: {errorMessage ? errorMessage : '없음'}</p>
            <p>아이템 수: {filteredItemsNew.length}</p>
          </div>

          <div className="filter-controls">
            <input
              type="text"
              placeholder="검색어"
              onChange={(e) => handleNewFilterChange('searchKeyword', e.target.value)}
            />
            <select
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                handleNewFilterChange('sortBy', sortBy);
                handleNewFilterChange('sortOrder', sortOrder as 'asc' | 'desc');
              }}
            >
              <option value="name-asc">이름 (오름차순)</option>
              <option value="name-desc">이름 (내림차순)</option>
              <option value="avgPrice-asc">가격 (오름차순)</option>
              <option value="avgPrice-desc">가격 (내림차순)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="benefits">
        <h2>개선된 상태 관리의 이점</h2>
        <ul>
          <li>
            <strong>코드 간소화:</strong> 반복적인 상태 관리 코드 제거로 더 짧고 명확한 컴포넌트
          </li>
          <li>
            <strong>비즈니스 로직 분리:</strong> 상태 관리 로직이 UI에서 분리되어 테스트 및
            유지보수가 용이
          </li>
          <li>
            <strong>성능 최적화:</strong> 선택자 패턴을 통한 불필요한 리렌더링 방지
          </li>
          <li>
            <strong>상태 공유:</strong> 여러 컴포넌트 간 상태 공유가 용이하며 데이터 일관성 보장
          </li>
          <li>
            <strong>미들웨어 통합:</strong> 지속성, 불변성, 개발 도구 등의 기능을 자동화된 방식으로
            통합
          </li>
        </ul>
      </div>
    </div>
  );
};

export default StateManagementComparison;
