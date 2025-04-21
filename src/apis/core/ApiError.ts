/**
 * API 에러 클래스
 *
 * 다양한 API 오류를 일관되게 처리하기 위한 표준화된 에러 클래스입니다.
 *
 * 이점:
 * 1. 일관된 에러 형식: 모든 API 에러가 동일한 구조로 처리됨
 * 2. 명확한 에러 코드: 문자열 기반 에러 코드로 쉽게 이해 가능
 * 3. 원본 에러 보존: 디버깅을 위해 원본 에러 정보 유지
 * 4. 타입 안전성: TypeScript를 활용한 에러 타입 보장
 */

// API 에러 코드 타입 정의
export type ApiErrorCode =
  | 'unauthorized' // 인증 필요 (401)
  | 'forbidden' // 접근 거부 (403)
  | 'not_found' // 리소스 없음 (404)
  | 'rate_limit_exceeded' // 요청 한도 초과 (429)
  | 'server_error' // 서버 오류 (5xx)
  | 'network_error' // 네트워크 연결 문제
  | 'request_canceled' // 요청 취소됨
  | 'api_error' // 일반 API 오류
  | 'unknown_error'; // 알 수 없는 오류

/**
 * API 에러 클래스
 *
 * 다양한 API 관련 오류를 캡슐화하는 표준화된 에러 클래스
 */
export class ApiError extends Error {
  /** 에러 코드 (표준화된 문자열) */
  public readonly code: ApiErrorCode;

  /** 상세 에러 메시지 */
  public readonly message: string;

  /** 원본 에러 객체 (있는 경우) */
  public readonly originalError?: any;

  /** 디버깅을 위한 추가 정보 */
  public readonly details?: Record<string, any>;

  /**
   * ApiError 생성자
   *
   * @param code 표준화된 에러 코드
   * @param message 사용자 친화적인 에러 메시지
   * @param originalError 원본 에러 (선택 사항)
   * @param details 추가 에러 세부 정보 (선택 사항)
   */
  constructor(
    code: ApiErrorCode,
    message: string,
    originalError?: any,
    details?: Record<string, any>
  ) {
    super(message);

    this.code = code;
    this.message = message;
    this.originalError = originalError;
    this.details = details;

    // 프로토타입 체인 올바르게 설정
    Object.setPrototypeOf(this, ApiError.prototype);

    // 스택 트레이스 캡처
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }

    // 원본 에러의 스택 트레이스 포함 (있는 경우)
    if (originalError && originalError.stack) {
      this.stack = `${this.stack}\nOriginal Error: ${originalError.stack}`;
    }

    // 개발 환경에서 에러 로깅
    if (process.env.NODE_ENV === 'development') {
      console.error(`🔴 API Error [${code}]:`, message, details || '');
    }
  }

  /**
   * 사용자에게 표시할 수 있는 에러 메시지 반환
   */
  public getUserMessage(): string {
    // 에러 유형에 따라 친화적인 메시지 제공
    switch (this.code) {
      case 'unauthorized':
        return '인증이 필요합니다. 다시 로그인해주세요.';
      case 'forbidden':
        return '해당 작업에 대한 권한이 없습니다.';
      case 'not_found':
        return '요청한 정보를 찾을 수 없습니다.';
      case 'rate_limit_exceeded':
        return '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.';
      case 'server_error':
        return '서버 오류가 발생했습니다. 나중에 다시 시도해주세요.';
      case 'network_error':
        return '네트워크 연결을 확인해주세요.';
      case 'request_canceled':
        return '요청이 취소되었습니다.';
      default:
        return this.message || '오류가 발생했습니다. 다시 시도해주세요.';
    }
  }

  /**
   * HTTP 상태 코드 반환 (해당하는 경우)
   */
  public getHttpStatus(): number | null {
    switch (this.code) {
      case 'unauthorized':
        return 401;
      case 'forbidden':
        return 403;
      case 'not_found':
        return 404;
      case 'rate_limit_exceeded':
        return 429;
      case 'server_error':
        return 500;
      default:
        return null; // 네트워크 오류 등은 HTTP 상태가 없음
    }
  }

  /**
   * 오류 객체를 일반 JSON 객체로 변환
   */
  public toJSON(): Record<string, any> {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      httpStatus: this.getHttpStatus(),
    };
  }
}
