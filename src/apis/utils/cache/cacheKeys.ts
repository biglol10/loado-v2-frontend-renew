/**
 * 체계적인 캐시 키 관리 시스템
 *
 * 이 파일은 애플리케이션 전체에서 사용되는 캐시 키의 구조와 생성 로직을 정의합니다.
 *
 * 이점:
 * 1. 일관성: 모든 컴포넌트에서 동일한 캐시 키 구조를 사용하여 중복 또는 충돌 방지
 * 2. 유지보수: 캐시 키 구조를 한 곳에서 관리하여 수정이 필요할 때 한 번만 변경
 * 3. 타입 안전성: TypeScript의 const assertion을 사용하여 타입 안전성 보장
 * 4. 계층적 무효화: 상위 수준의 키를 무효화하면 모든 하위 키가 자동으로 무효화
 */
export const cacheKeys = {
  itemPrice: {
    all: ['itemPrice'] as const, // 모든 아이템 가격 데이터의 루트 키
    lists: () => [...cacheKeys.itemPrice.all, 'list'] as const, // 목록 조회에 대한 상위 키
    list: (filters: string) => [...cacheKeys.itemPrice.lists(), filters] as const, // 특정 필터로 조회된 목록
    details: () => [...cacheKeys.itemPrice.all, 'detail'] as const, // 상세 조회에 대한 상위 키
    detail: (id: string) => [...cacheKeys.itemPrice.details(), id] as const, // 특정 ID의 상세 정보
  },
  simulation: {
    all: ['simulation'] as const, // 모든 시뮬레이션 데이터의 루트 키
    results: () => [...cacheKeys.simulation.all, 'results'] as const, // 시뮬레이션 결과에 대한 상위 키
    result: (params: string) => [...cacheKeys.simulation.results(), params] as const, // 특정 파라미터로 실행된 시뮬레이션 결과
  },
} as const; // 모든 키가 읽기 전용이 되도록 const assertion 사용
