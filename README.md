# Loado v2 Frontend

로스트아크 게임 관련 정보와 도구를 제공하는 웹 애플리케이션 프론트엔드입니다.

## 기술 스택

- React 18
- TypeScript
- Vite
- React Query (@tanstack/react-query)
- Material UI
- Axios
- React Router
- i18next
- Zustand

## 주요 기능

- 로스트아크 아이템 가격 정보 조회
- 아이템 시뮬레이션 기능
- 다국어 지원 (i18n)
- 사용자 설정 및 관리

## 환경 설정

### 개발 환경 실행

```bash
# 로컬 환경 실행
npm run local

# 개발 환경 실행
npm run dev
```

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과물 미리보기
npm run preview
```

## 성능 최적화

### 캐싱 전략

본 프로젝트는 React Query를 사용하여 체계적인 캐싱 전략을 구현하고 있습니다.

#### 주요 캐싱 설정

- `staleTime`: 데이터가 오래된 것으로 간주되기 전까지의 시간
- `gcTime`: 미사용 데이터가 메모리에서 유지되는 시간
- 리소스별 다른 캐싱 전략 적용:
  - 정적 데이터: 1시간 staleTime, 24시간 gcTime
  - 중간 주기 데이터: 5분 staleTime, 30분 gcTime
  - 동적 데이터: 30초 staleTime, 5분 gcTime
  - 사용자 데이터: 30분 staleTime, 24시간 gcTime

#### 사용법

```tsx
// 기본 사용법
import { useQuery } from '@tanstack/react-query';
import { cacheKeys, getCachingConfig } from '@/apis/utils/cache';

// 캐시 설정 가져오기
const cacheConfig = getCachingConfig('moderate');

// 쿼리 사용
const { data, isLoading } = useQuery({
  queryKey: [...cacheKeys.itemPrice.all, 'customKey'],
  queryFn: fetchData,
  staleTime: cacheConfig.staleTime,
  gcTime: cacheConfig.gcTime,
});
```

### 성능 모니터링 시스템

로컬 및 개발 환경에서 애플리케이션 성능을 모니터링할 수 있는 시스템이 내장되어 있습니다.

#### 주요 기능

- 페이지 로드 성능 측정 (FCP, LCP, CLS 등)
- API 호출 성능 모니터링
- 컴포넌트 렌더링 성능 측정
- 메모리 사용량 모니터링
- 성능 대시보드 제공

#### 사용법

```tsx
// 컴포넌트 렌더링 성능 측정
import { useRenderPerformance } from '@/performance';

const MyComponent = () => {
  // 컴포넌트 이름을 전달하여 렌더링 성능 측정
  useRenderPerformance('MyComponent');

  return <div>내용</div>;
};

// API 호출 성능 측정
import { useApiPerformance } from '@/performance';

const MyApiComponent = () => {
  const { startApiCall, endApiCall } = useApiPerformance();

  const fetchData = async () => {
    const measureId = startApiCall('/api/data', 'GET');
    try {
      const response = await fetch('/api/data');
      const data = await response.json();
      endApiCall(measureId, 200);
      return data;
    } catch (error) {
      endApiCall(measureId, 500);
      throw error;
    }
  };

  return <div>...</div>;
};

// 모니터링된 쿼리 사용
import { useMonitoredQuery } from '@/performance';

const { data } = useMonitoredQuery(['key'], fetchFn);
```

#### 성능 대시보드

로컬 또는 개발 환경에서는 화면 우측 하단에 성능 대시보드 토글 버튼이 표시됩니다. 이를 클릭하여 실시간 성능 메트릭을 확인할 수 있습니다.

## 프로젝트 구조

```
src/
├── apis/              # API 관련 코드
│   ├── utils/
│   │   ├── cache/     # 캐싱 전략 관련 유틸리티
│   │   ├── AxiosInstance.ts
│   │   └── queryClient.ts
│   └── [리소스]/       # 리소스별 API 훅
├── assets/            # 정적 자산 (이미지, 폰트 등)
├── components/        # 재사용 가능한 컴포넌트
├── locales/           # 다국어 지원 파일
├── mocks/             # API 모킹 관련 파일
├── pages/             # 페이지 컴포넌트
├── performance/       # 성능 모니터링 시스템
│   ├── components/    # 성능 관련 컴포넌트
│   ├── hooks/         # 성능 모니터링 훅
│   └── PerformanceManager.ts
├── routers/           # 라우팅 설정
├── store/             # 상태 관리 (Zustand)
└── utils/             # 유틸리티 함수
```

## 베스트 프랙티스

### 성능 최적화

- React Query를 사용하여 적절한 캐싱 전략 적용하기
- 중복 렌더링 및 불필요한 리렌더링 방지
- 성능 모니터링 시스템을 활용하여 병목 지점 식별 및 최적화

### 코드 품질

- TypeScript 타입 정의를 철저히 사용
- 일관된 디렉토리 구조와 네이밍 컨벤션 유지
- ESLint 및 Prettier를 사용한 코드 표준화

## 라이센스

이 프로젝트는 Private 저장소이며, 모든 권리가 보호됩니다.
