import React, { useEffect, useState } from 'react';
import {
  // 이전 스타일 API 임포트
  useItemPriceQuery as OldItemPriceQuery,
} from '../../apis/itemPrice/useItemPriceQuery';

import {
  // 새로운 API 레이어 임포트
  useMultiCategoryItemPrices,
  ITEM_CATEGORIES,
} from '../../apis/itemPrice-v2';

/**
 * API 사용법 비교 컴포넌트
 *
 * 이 컴포넌트는 이전 방식과 개선된 API 레이어의 사용법을 비교하여 보여줍니다.
 *
 * 이점:
 * 1. 코드 간소화: 보일러플레이트 코드 감소로 가독성 향상
 * 2. 선언적 접근: 복잡한 로직 대신 선언적 훅 사용
 * 3. 에러 처리 개선: 표준화된 에러 처리 메커니즘
 * 4. 타입 안전성: 강화된 타입스크립트 지원
 */
const ApiUsageComparison: React.FC = () => {
  const [searchDate, setSearchDate] = useState(new Date().toISOString().split('T')[0]);

  // ====================== 이전 방식의 API 사용 ======================
  const oldQueryResult = OldItemPriceQuery({
    searchDate,
    staleTime: 5 * 60 * 1000,
  });

  const {
    isSuccess: oldIsSuccess,
    isError: oldIsError,
    isFetching: oldIsFetching,
    data: oldData,
  } = oldQueryResult;

  // ====================== 개선된 API 레이어 사용 ======================
  const {
    data: newData,
    isLoading: newIsLoading,
    isError: newIsError,
    refetch: newRefetch,
  } = useMultiCategoryItemPrices(searchDate, [
    ITEM_CATEGORIES.BATTLE_ITEM,
    ITEM_CATEGORIES.ENGRAVING,
  ]);

  // 날짜 변경 핸들러
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchDate(e.target.value);
  };

  // 수동 리로드 핸들러
  const handleReload = () => {
    newRefetch();
  };

  return (
    <div className="api-comparison">
      <h1>API 사용법 비교</h1>

      <div className="controls">
        <div className="date-selector">
          <label>날짜 선택:</label>
          <input type="date" value={searchDate} onChange={handleDateChange} />
        </div>
        <button onClick={handleReload}>수동 새로고침</button>
      </div>

      <div className="comparison-container">
        {/* 이전 방식 섹션 */}
        <div className="old-style">
          <h2>이전 방식 API 사용</h2>
          <pre>
            {`
// 복잡한 옵션 필요
const oldQueryResult = useItemPriceQuery({
  searchDate,
  staleTime: 5 * 60 * 1000
});

const {
  isSuccess,
  isError,
  isFetching,
  data
} = oldQueryResult;

// 데이터 접근이 복잡함
const items = data?.map(result => result?.data)
  .flat()
  .filter(Boolean);
            `}
          </pre>

          <div className="status-indicators">
            <p>로딩 중: {oldIsFetching ? '예' : '아니오'}</p>
            <p>성공: {oldIsSuccess ? '예' : '아니오'}</p>
            <p>에러: {oldIsError ? '예' : '아니오'}</p>
            <p>
              아이템 수:{' '}
              {oldData?.map((d) => d?.data?.length).reduce((a, b) => (a || 0) + (b || 0), 0) || 0}
            </p>
          </div>
        </div>

        {/* 개선된 방식 섹션 */}
        <div className="new-style">
          <h2>개선된 API 레이어 사용</h2>
          <pre>
            {`
// 간결하고 직관적인 훅 사용
const {
  data,
  isLoading,
  isError,
  refetch
} = useMultiCategoryItemPrices(
  searchDate,
  [ITEM_CATEGORIES.BATTLE_ITEM, ITEM_CATEGORIES.ENGRAVING]
);

// 데이터가 바로 접근 가능
const items = data?.flat();
            `}
          </pre>

          <div className="status-indicators">
            <p>로딩 중: {newIsLoading ? '예' : '아니오'}</p>
            <p>성공: {!newIsLoading && !newIsError ? '예' : '아니오'}</p>
            <p>에러: {newIsError ? '예' : '아니오'}</p>
            <p>아이템 수: {newData?.flat().length || 0}</p>
          </div>
        </div>
      </div>

      <div className="benefits">
        <h2>개선된 API 레이어의 이점</h2>
        <ul>
          <li>
            <strong>코드 간소화:</strong> 보일러플레이트 코드 감소로 더 짧고 읽기 쉬운 코드
          </li>
          <li>
            <strong>에러 처리 개선:</strong> 일관된 에러 처리 메커니즘으로 UI에 더 쉽게 에러 상태
            반영
          </li>
          <li>
            <strong>타입 안전성:</strong> 강화된 타입스크립트 지원으로 개발 시 자동완성 및 타입 검사
            개선
          </li>
          <li>
            <strong>캐싱 전략 개선:</strong> 데이터 유형별 최적화된 캐싱 설정으로 불필요한 네트워크
            요청 감소
          </li>
          <li>
            <strong>상태 관리 통합:</strong> React Query와 Zustand의 자연스러운 통합으로 클라이언트
            상태와 서버 상태의 효율적인 관리
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ApiUsageComparison;
