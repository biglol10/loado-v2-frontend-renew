/**
 * 아이템 가격 정보 관련 타입 정의
 *
 * 이 파일은 아이템 가격 API 관련 타입 정의를 제공합니다.
 *
 * 이점:
 * 1. 타입 안전성: 명확한 인터페이스 정의로 런타임 오류 감소
 * 2. 코드 가독성: 구조화된 타입으로 데이터 흐름 이해 용이
 * 3. 자동완성: IDE에서 아이템 속성에 대한 자동완성 지원
 */

/**
 * 아이템 기본 정보 인터페이스
 */
export interface ItemBase {
  id: string; // 아이템 ID
  name: string; // 아이템 이름
  grade: string; // 아이템 등급 (일반, 고급, 희귀, 영웅, 전설 등)
  icon: string; // 아이템 아이콘 URL
  categoryCode: string; // 아이템 카테고리 코드
}

/**
 * 아이템 가격 정보 인터페이스
 */
export interface ItemPrice {
  avgPrice: number; // 평균 가격
  currentMinPrice: number; // 현재 최저가
  recentPrice: number; // 최근 거래가
  timestamp: string; // 가격 정보 타임스탬프
}

/**
 * 아이템 거래 정보 인터페이스
 */
export interface ItemTrade {
  tradeCount: number; // 거래량
  isTradable: boolean; // 거래 가능 여부
}

/**
 * 완전한 아이템 데이터 인터페이스
 * 기본 정보, 가격 정보, 거래 정보를 모두 포함
 */
export interface ItemData extends ItemBase, ItemPrice, ItemTrade {}

/**
 * 아이템 가격 조회 요청 파라미터 인터페이스
 */
export interface ItemPriceQueryParams {
  categoryCode: string; // 아이템 카테고리 코드
  timeValue: string; // 검색 날짜 (YYYY-MM-DD 형식)
  itemName?: string; // 선택적 아이템 이름 필터
  itemGrade?: string; // 선택적 아이템 등급 필터
}

/**
 * 단일 아이템 가격 조회 요청 파라미터 인터페이스
 */
export interface SingleItemPriceQueryParams {
  itemId: string; // 아이템 ID
  timeRange?: string; // 선택적 시간 범위 (day, week, month)
}

/**
 * 아이템 가격 시계열 데이터 인터페이스
 */
export interface ItemPriceTimeSeries {
  date: string; // 날짜
  avgPrice: number; // 해당 날짜의 평균 가격
  minPrice: number; // 해당 날짜의 최저가
  maxPrice: number; // 해당 날짜의 최고가
  tradeCount: number; // 해당 날짜의 거래량
}

/**
 * 아이템 카테고리 정보
 */
export const ITEM_CATEGORIES = {
  BATTLE_ITEM: '50010', // 배틀 아이템
  LIFE_ITEM: '50020', // 생활 도구
  ENGRAVING: '44410', // 각인서
  GEM: '210000', // 보석
  MATERIAL: '51100', // 재료
} as const;

/**
 * 아이템 카테고리 코드 타입
 */
export type ItemCategoryCode = (typeof ITEM_CATEGORIES)[keyof typeof ITEM_CATEGORIES];
