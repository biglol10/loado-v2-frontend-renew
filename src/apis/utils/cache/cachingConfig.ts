/**
 * 리소스 유형별 캐싱 설정
 * staleTime: 데이터가 신선하다고 간주되는 시간(밀리초)
 * gcTime: 캐시된 데이터가 메모리에 유지되는 시간(밀리초)
 */
export const cachingConfig = {
  // 자주 변경되지 않는 데이터 (아이템 정보 등)
  static: {
    staleTime: 60 * 60 * 1000, // 1시간
    gcTime: 24 * 60 * 60 * 1000, // 24시간
  },

  // 가격 정보 같은 중간 정도로 변경되는 데이터
  moderate: {
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 30 * 60 * 1000, // 30분
  },

  // 자주 변경되는 데이터 (실시간 정보)
  dynamic: {
    staleTime: 30 * 1000, // 30초
    gcTime: 5 * 60 * 1000, // 5분
  },

  // 사용자 정보 등 거의 변경되지 않는 데이터
  user: {
    staleTime: 30 * 60 * 1000, // 30분
    gcTime: 24 * 60 * 60 * 1000, // 24시간
  },
};

/**
 * 리소스에 따른 적절한 캐싱 설정을 반환하는 함수
 * @param resourceType 리소스 유형
 * @returns 캐싱 설정
 */
export function getCachingConfig(resourceType: keyof typeof cachingConfig) {
  return cachingConfig[resourceType];
}
