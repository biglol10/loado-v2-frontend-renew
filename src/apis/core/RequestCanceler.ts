import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios';

/**
 * 요청 취소 관리자 클래스
 *
 * 중복 요청 방지 및 사용자 취소를 지원하기 위한 요청 취소 메커니즘을 제공합니다.
 *
 * 이점:
 * 1. 중복 요청 방지: 동일한 요청이 이미 진행 중인 경우 이전 요청 취소
 * 2. 리소스 최적화: 더 이상 필요 없는 요청 취소로 리소스 절약
 * 3. UX 개선: 사용자가 페이지 이동 시 불필요한 요청을 취소하여 성능 개선
 * 4. 메모리 누수 방지: 취소된 요청의 취소 토큰 정리
 */
export class RequestCanceler {
  /** 활성 요청 맵 (요청 ID -> 취소 토큰 소스) */
  private pendingRequests: Map<string, CancelTokenSource>;

  /**
   * 생성자
   */
  constructor() {
    this.pendingRequests = new Map<string, CancelTokenSource>();
  }

  /**
   * 새 요청 등록
   * 동일한 ID의 이전 요청이 있으면 취소
   *
   * @param requestId 요청 고유 ID
   * @param config 요청 설정 (선택 사항)
   * @returns 취소 토큰 소스
   */
  public register(requestId: string, config?: AxiosRequestConfig): CancelTokenSource {
    // 이미 진행 중인 동일한 요청이 있으면 취소
    this.cancelRequest(requestId, '이전 중복 요청 취소됨');

    // 새 취소 토큰 생성
    const source = axios.CancelToken.source();

    // 요청 등록
    this.pendingRequests.set(requestId, source);

    // 설정이 있으면 취소 토큰 설정
    if (config) {
      config.cancelToken = source.token;
    }

    return source;
  }

  /**
   * 완료된 요청 등록 해제
   *
   * @param requestId 요청 고유 ID
   * @returns 요청이 존재했고 등록 해제되었는지 여부
   */
  public unregister(requestId: string): boolean {
    return this.pendingRequests.delete(requestId);
  }

  /**
   * 특정 요청 취소
   *
   * @param requestId 취소할 요청 ID
   * @param reason 취소 이유 (선택 사항)
   * @returns 요청이 존재했고 취소되었는지 여부
   */
  public cancelRequest(requestId: string, reason?: string): boolean {
    const source = this.pendingRequests.get(requestId);

    if (source) {
      source.cancel(reason || '요청 취소됨');
      this.pendingRequests.delete(requestId);
      return true;
    }

    return false;
  }

  /**
   * 취소 토큰 가져오기
   *
   * @param requestId 요청 ID
   * @returns 취소 토큰 소스 또는 undefined
   */
  public getCancelToken(requestId: string): CancelTokenSource | undefined {
    return this.pendingRequests.get(requestId);
  }

  /**
   * 모든 활성 요청 취소
   *
   * @param reason 취소 이유 (선택 사항)
   */
  public cancelAll(reason?: string): void {
    this.pendingRequests.forEach((source, id) => {
      source.cancel(reason || '모든 요청 취소됨');
    });

    this.pendingRequests.clear();
  }

  /**
   * 활성 요청 수 가져오기
   *
   * @returns 활성 요청 수
   */
  public getPendingCount(): number {
    return this.pendingRequests.size;
  }

  /**
   * 활성 요청 ID 목록 가져오기
   *
   * @returns 활성 요청 ID 배열
   */
  public getPendingRequestIds(): string[] {
    return Array.from(this.pendingRequests.keys());
  }
}
