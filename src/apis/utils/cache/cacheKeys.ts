/**
 * 캐시 키 관리를 위한 유틸리티 객체
 * 각 API 엔드포인트마다 키를 관리하고, 키를 생성하는 함수를 제공합니다.
 */
export const cacheKeys = {
  itemPrice: {
    all: ['itemPrice'] as const,
    list: () => [...cacheKeys.itemPrice.all, 'list'] as const,
    detail: (id: string) => [...cacheKeys.itemPrice.all, 'detail', id] as const,
  },
  user: {
    all: ['user'] as const,
    profile: () => [...cacheKeys.user.all, 'profile'] as const,
    settings: () => [...cacheKeys.user.all, 'settings'] as const,
  },
  simulation: {
    all: ['simulation'] as const,
    results: (params: Record<string, any>) =>
      [...cacheKeys.simulation.all, 'results', JSON.stringify(params)] as const,
  },
};
