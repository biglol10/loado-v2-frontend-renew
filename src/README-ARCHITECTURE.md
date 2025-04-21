# 로아도 프론트엔드 아키텍처 가이드

이 문서는 로아도 프론트엔드 프로젝트의 개선된 아키텍처에 대한 가이드입니다. 새로운 구조와 패턴을 소개하고, 코드 작성 시 참고할 수 있는 가이드라인을 제공합니다.

## 목차

1. [새로운 아키텍처 개요](#1-새로운-아키텍처-개요)
2. [API 레이어](#2-api-레이어)
3. [상태 관리](#3-상태-관리)
4. [컴포넌트 디자인 패턴](#4-컴포넌트-디자인-패턴)
5. [예제 코드](#5-예제-코드)
6. [마이그레이션 가이드](#6-마이그레이션-가이드)

## 1. 새로운 아키텍처 개요

### 주요 개선 사항

1. **API 레이어 체계화**

   - 중앙화된 API 클라이언트 및 에러 처리
   - React Query를 활용한 데이터 페칭 최적화
   - 구조화된 API 훅 시스템

2. **상태 관리 체계화**

   - Zustand를 활용한 확장 가능한 상태 관리
   - 선택자 패턴을 통한 성능 최적화
   - 비즈니스 로직 분리

3. **타입 안전성 강화**

   - 일관된 타입 정의 및 인터페이스
   - 공통 타입 활용으로 중복 감소

4. **코드 구성 개선**
   - 관심사 분리(Separation of Concerns)
   - 기능별 모듈화
   - 재사용 가능한 유틸리티

### 폴더 구조

```
src/
├── apis/                # API 관련 코드
│   ├── core/            # API 코어 기능 (클라이언트, 에러 처리 등)
│   │   ├── hooks/       # API 관련 공통 훅
│   │   └── ...
│   ├── {feature}-v2/    # 기능별 API 모듈 (v2는 새 구조로 마이그레이션됨을 의미)
│   │   ├── api.ts       # API 호출 함수
│   │   ├── queries.ts   # React Query 훅
│   │   ├── types.ts     # 타입 정의
│   │   └── index.ts     # 모듈 내보내기
│   └── ...
│
├── store/               # 상태 관리
│   ├── core/            # 상태 관리 코어 기능
│   │   ├── createStore.ts # 스토어 생성 유틸리티
│   │   ├── selectors.ts # 선택자 유틸리티
│   │   └── ...
│   ├── {feature}/       # 기능별 상태 모듈
│   │   ├── store.ts     # 스토어 구현
│   │   ├── selectors.ts # 선택자 함수
│   │   ├── types.ts     # 타입 정의
│   │   └── index.ts     # 모듈 내보내기
│   └── ...
│
├── components/          # 리액트 컴포넌트
│   ├── common/          # 공통 컴포넌트
│   ├── {feature}/       # 기능별 컴포넌트
│   └── examples/        # 예제 컴포넌트
│
├── utils/               # 유틸리티 함수
└── ...
```

## 2. API 레이어

### 핵심 구성 요소

#### ApiClient (apis/core/ApiClient.ts)

중앙화된 HTTP 클라이언트로 모든 API 요청을 처리합니다.

```typescript
import { apiClient } from '@/apis/core';

// 사용 예시
const response = await apiClient.get('/api/endpoint', { param1: 'value1' });
```

#### ApiError (apis/core/ApiError.ts)

표준화된 에러 처리 메커니즘을 제공합니다.

```typescript
try {
  // API 호출
} catch (error) {
  if (error instanceof ApiError) {
    console.log(error.code); // 에러 코드 (예: 'unauthorized')
    console.log(error.message); // 에러 메시지
    console.log(error.getUserMessage()); // 사용자에게 표시할 메시지
  }
}
```

#### 커스텀 훅 (apis/core/hooks)

React Query를 래핑한 커스텀 훅을 제공합니다.

```typescript
// 쿼리 훅
const { data, isLoading, error } = useApiQuery(['cache-key'], () => fetchData());

// 뮤테이션 훅
const { mutate, isLoading } = useApiMutation((data) => updateData(data), {
  invalidateQueries: ['cache-key'], // 자동으로 관련 쿼리 무효화
});
```

### 모듈 구성 패턴

각 기능별 API 모듈은 다음과 같은 구성을 따릅니다:

1. **types.ts**: 데이터 타입과 인터페이스 정의
2. **api.ts**: 실제 API 호출 함수
3. **queries.ts**: React Query 훅
4. **index.ts**: 모듈 내보내기

```typescript
// api.ts - API 호출 함수
export async function fetchItems(params) {
  return apiClient.get<ApiResponse<Item[]>>('/api/items', params);
}

// queries.ts - React Query 훅
export function useItems(params, options = {}) {
  return useApiQuery(itemKeys.list(params), () => fetchItems(params), options);
}
```

## 3. 상태 관리

### 핵심 구성 요소

#### createStore (store/core/createStore.ts)

Zustand 스토어를 생성하는 표준화된 함수입니다.

```typescript
const useMyStore = createStore<MyState>(
  (set, get) => ({
    // 초기 상태
    count: 0,
    // 액션
    increment: () =>
      set((state) => {
        state.count += 1;
      }),
    decrement: () =>
      set((state) => {
        state.count -= 1;
      }),
  }),
  {
    name: 'my-store', // 개발 도구에 표시될 이름
    persist: true, // 로컬 스토리지에 상태 유지
  }
);
```

#### 선택자 (store/core/selectors.ts)

성능이 최적화된 상태 선택 유틸리티를 제공합니다.

```typescript
// 선택자 정의
export const selectCount = (state) => state.count;

// 컴포넌트에서 사용
const count = useMyStore(selectCount);
```

### 모듈 구성 패턴

각 기능별 상태 모듈은 다음과 같은 구성을 따릅니다:

1. **types.ts**: 상태 타입과 인터페이스 정의
2. **store.ts**: 스토어 구현
3. **selectors.ts**: 선택자 함수
4. **index.ts**: 모듈 내보내기

```typescript
// store.ts - 스토어 구현
export const useItemStore = createStore<ItemState>((set, get) => ({
  items: [],
  loading: false,
  error: null,
  fetchItems: async () => {
    set((state) => {
      state.loading = true;
    });
    try {
      const items = await api.fetchItems();
      set((state) => {
        state.items = items;
        state.loading = false;
      });
    } catch (error) {
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
    }
  },
}));

// selectors.ts - 선택자 함수
export const selectItems = (state) => state.items;
export const selectLoading = (state) => state.loading;
```

## 4. 컴포넌트 디자인 패턴

### 구조화된 컴포넌트 패턴

```tsx
import React from 'react';
import { useApiQuery } from '@/apis/core/hooks';
import { useMyStore, selectItems } from '@/store/my-feature';

// 데이터 요청과 상태 관리를 함께 사용하는 패턴
const MyComponent: React.FC = () => {
  // API 요청 (서버 상태)
  const { data, isLoading: queryLoading } = useApiQuery(['my-data'], () => fetchMyData());

  // 상태 관리 (클라이언트 상태)
  const { fetchItems } = useMyStore();
  const items = useMyStore(selectItems);

  // 효과적인 데이터 요청
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return <div>{/* 컴포넌트 렌더링 로직 */}</div>;
};
```

## 5. 예제 코드

예제 코드는 `src/components/examples` 디렉토리에 있습니다:

- `ItemPriceExample.tsx`: API 레이어와 상태 관리 통합 예제
- `ApiUsageComparison.tsx`: 이전 방식과 새로운 API 레이어 비교
- `StateManagementComparison.tsx`: 이전 방식과 새로운 상태 관리 비교

## 6. 마이그레이션 가이드

### 단계적 마이그레이션

1. **API 레이어 마이그레이션**

   - 새 기능은 새 API 레이어로 개발
   - 기존 기능은 `-v2` 접미사를 가진 새 디렉토리에 마이그레이션
   - 기존 코드와 새 코드가 공존할 수 있도록 유지

2. **상태 관리 마이그레이션**
   - 새 기능은 새 스토어 패턴으로 개발
   - 기존 상태 관리 코드를 점진적으로 새 패턴으로 리팩토링

### 마이그레이션 체크리스트

- [ ] API 함수를 `api.ts`로 이동
- [ ] React Query 훅을 `queries.ts`로 이동
- [ ] 타입 정의를 `types.ts`로 이동
- [ ] 상태 관리 코드를 스토어 모듈로 변환
- [ ] 선택자 함수 정의

## 이점 요약

1. **개발 경험 향상**

   - 일관된 코드 스타일 및 구성
   - 명확한 패턴으로 코드 가독성 향상
   - 강화된 타입 안전성으로 오류 감소

2. **성능 최적화**

   - 효율적인 데이터 캐싱
   - 불필요한 렌더링 방지
   - 최적화된 상태 접근

3. **유지보수성 향상**

   - 관심사 분리로 코드 변경 영향 범위 최소화
   - 모듈화로 확장 용이
   - 표준화된 패턴으로 새 개발자 온보딩 간소화

4. **사용자 경험 개선**
   - 더 빠른 데이터 로딩
   - 일관된 에러 처리
   - 더 반응성 높은 UI

---

구현된 주요 기능

1. API 레이어 개선

중앙화된 API 클라이언트: 모든 API 요청을 일관되게 처리하는 ApiClient 클래스
표준화된 에러 처리: 명확한 에러 코드와 메시지를 제공하는 ApiError 클래스
요청 취소 관리: 중복 요청 방지 및 사용자 취소 지원을 위한 RequestCanceler 클래스
React Query 통합: 데이터 페칭, 캐싱, 동기화를 위한 QueryProvider 및 커스텀 훅 제공
도메인별 API 모듈화: 아이템 가격 정보 API를 체계적으로 구조화한 모듈 구현

2. 상태 관리 체계화

확장 가능한 스토어 생성 유틸리티: 일관된 Zustand 스토어 생성을 위한 createStore 함수
선택자 패턴: 효율적인 상태 접근을 위한 선택자 유틸리티
비동기 액션 처리: 비동기 작업의 상태를 관리하는 handleAsync 유틸리티
도메인별 스토어 모듈화: 아이템 가격 정보를 관리하는 체계적인 스토어 구현
타입 안전성: 전체 상태 관리 시스템에 타입스크립트 적용

3. 사용 예제 제공

ItemPriceExample: API 레이어와 상태 관리 통합 사용 예제
ApiUsageComparison: 이전 방식과 새로운 API 레이어 비교
StateManagementComparison: 이전 방식과 새로운 상태 관리 비교

도입된 구조의 이점
API 레이어 이점

코드 간소화: 반복적인 API 호출 코드 감소로 가독성 향상
에러 처리 개선: 일관된 에러 처리 메커니즘으로 UI에 에러 상태 쉽게 반영
타입 안전성: 강화된 타입스크립트 지원으로 개발 시 자동완성 및 타입 검사 개선
캐싱 전략 최적화: 데이터 유형별 최적화된 캐싱으로 불필요한 네트워크 요청 감소
관심사 분리: API 호출 로직과 UI 로직 분리로 테스트 및 유지보수 용이

상태 관리 이점

코드 일관성: 모든 상태 관리 코드가 동일한 패턴을 따라 코드 예측 가능성 향상
성능 최적화: 선택자 패턴으로 불필요한 렌더링 방지
비즈니스 로직 분리: UI 컴포넌트에서 상태 관리 로직 분리로 코드 복잡성 감소
상태 공유: 여러 컴포넌트 간 상태 공유가 용이하며 데이터 일관성 보장
개발 경험 향상: 직관적인 상태 접근 및 수정 API로 개발 효율성 증대

마이그레이션 방법
프로젝트의 기존 코드를 새로운 구조로 마이그레이션하는 방법은 README-ARCHITECTURE.md 파일에 상세히 문서화했습니다. 이 문서는 개발자들이 새로운 아키텍처를 이해하고 적용하는 데 도움이 될 것입니다.
요약하자면, 이번 개선으로 코드 품질, 유지보수성, 성능, 개발 경험이 크게 향상될 것으로 기대됩니다. 새로운 기능 개발 시 이 구조를 따르고, 기존 코드는 점진적으로 마이그레이션하는 것을 권장합니다.재시도Claude는 실수를 할 수 있습니다. 응답을 반드시 다시 확인해 주세요.53 3.7 Sonnet
