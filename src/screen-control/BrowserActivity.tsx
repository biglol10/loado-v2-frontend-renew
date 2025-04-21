import { eventRegister, eventRemove } from '@/utils/events';
import { useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import userStore from '@/store/user/useUserStore';
import setupLocatorUI from '@locator/runtime';
import { initWebVitals } from '@/utils/performance/metrics';
import { trackNetworkRequests } from '@/utils/performance/tracking';
import { initPerformanceReporter } from '@/utils/performance/reporter';
import AxiosInstance from '@/apis/utils/AxiosInstance';
import { trackMetric } from '../utils/performance/reporter';
import { isDev } from '../utils/environment';

/**
 * 브라우저 활동 모니터링 및 전역 이벤트 처리 컴포넌트
 *
 * 이 컴포넌트는 애플리케이션 전체에서 공통으로 적용되는 기능을 관리합니다:
 * 1. 성능 모니터링 시스템 초기화
 * 2. 전역 이벤트 리스너 등록
 * 3. 디바이스 탐지 및 대응
 *
 * 이점:
 * - 성능 최적화: 사용자 경험에 영향을 미치는 성능 지표 측정
 * - 유지보수성: 전역 기능을 한 곳에서 관리
 * - 일관성: 모든 화면에서 동일한 기본 기능 제공
 */

const BrowserActivity = () => {
  const isLocal = process.env.MODE === 'local';

  const navigate = useNavigate();
  const { setIsMobile } = userStore();

  // 모바일 기기 감지 및 상태 설정
  useLayoutEffect(() => {
    if (isMobile) {
      return setIsMobile(true);
    }
    setIsMobile(false);
  }, [setIsMobile]);

  // 성능 모니터링 시스템 초기화
  useEffect(() => {
    /**
     * Web Vitals 측정 초기화
     * - 사용자가 실제로 체감하는 성능 지표(LCP, FID, CLS 등) 측정
     * - 성능 최적화 방향 제시
     */
    initWebVitals((metric) => {
      // 콜백은 유지하되 내부 로깅은 이미 isDev() 조건으로 제한됨

      // 프로덕션 환경에서는 데이터 수집만 진행하고 로깅 없음
      const isProd = process.env.MODE === 'production';
      if (isProd) {
        // 프로덕션에서는 원격 분석 시스템에만 데이터 전송
        // 예: 애널리틱스 시스템으로 데이터 전송
      }
    });

    /**
     * 네트워크 요청 추적 활성화
     * - 개발 환경에서는 상세 로깅 포함, 프로덕션에서는 로깅 없음
     * - 느린 요청 및 실패한 요청 감지
     */
    trackNetworkRequests(AxiosInstance);

    /**
     * 성능 리포팅 초기화
     * - 프로덕션 환경에서만 활성화하여 개발 중 불필요한 데이터 전송 방지
     * - 실제 사용자 환경에서의 성능 데이터 수집
     */
    const isProd = process.env.MODE === 'production';
    if (isProd) {
      initPerformanceReporter('/api/performance-metrics');
    }

    // 개발 환경에서만 초기화 로그 출력
    if (isDev()) {
      console.log('성능 모니터링 시스템 초기화 완료');
    }
  }, []);

  // 전역 이벤트 리스너 등록
  useEffect(() => {
    // 뒤로가기 이벤트 처리
    const listener = (e: Event) => {
      const event = e as CustomEvent<string>;
      const data = event.detail;

      // 개발 환경에서만 로깅
      if (isDev()) {
        console.log(data);
      }
      navigate(-1);
    };

    // 로그인 페이지 리디렉션 처리
    const goToLoginPage = () => {
      navigate('/');
    };

    // 개발 도구 활성화 (로컬 환경에서만)
    const activateLocatorJs = (event: any) => {
      if (event.ctrlKey && event.altKey && event.key.toLocaleLowerCase() === 'l') {
        if (isLocal) {
          setupLocatorUI();
        }
      }
    };

    // 이벤트 리스너 등록
    eventRegister('@back', listener);
    eventRegister('@login-redirect', goToLoginPage);
    eventRegister('keydown', activateLocatorJs);

    // 컴포넌트 언마운트 시 리스너 제거 (메모리 누수 방지)
    return () => {
      eventRemove('@back', listener);
      eventRemove('@login-redirect', goToLoginPage);
      eventRemove('keydown', activateLocatorJs);
    };
  }, [navigate]);

  // 이 컴포넌트는 UI를 렌더링하지 않음 (순수 기능적 컴포넌트)
  return <></>;
};

export default BrowserActivity;
