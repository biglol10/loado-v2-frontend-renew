import { QueryCache, QueryClient } from '@tanstack/react-query';
import axios from 'axios';
import i18n from '@/locales/i18n';
import { showErrorToast, showSuccessToast } from '@/utils/toastUtils';

/**
 * 쿼리/뮤테이션 공통 에러 핸들러.
 * React 외부(모듈 스코프)에서도 동작해야 하므로 훅(useTranslation)이 아닌
 * i18n 싱글톤의 t()를 직접 사용한다.
 */
const handleQueryError = (error: unknown) => {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    showErrorToast(i18n.t('common.error.network'));
    return;
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    if (status === 500) {
      showErrorToast(i18n.t('common.error.server'));
    } else if (status) {
      showErrorToast(i18n.t('common.error.api'));
    } else if (error.message === 'Network Error') {
      showErrorToast(i18n.t('common.error.network'));
    } else {
      showErrorToast(i18n.t('common.error.unknown'));
    }
    return;
  }

  showErrorToast(i18n.t('common.error.unknown'));
};

/**
 * 앱 전체에서 공유하는 단일 QueryClient 인스턴스.
 * Provider, 캐시 유틸(cacheUtils) 모두 이 인스턴스를 사용해야 캐시 조작이 화면에 반영된다.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      staleTime: 5 * 60 * 1000, // 5분 동안 데이터를 신선한 상태로 유지
      gcTime: 10 * 60 * 1000, // 10분 동안 미사용 데이터를 메모리에 유지
      throwOnError: false,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: 0,
      throwOnError: false,
      onError: handleQueryError,
      onSuccess: () => {
        showSuccessToast(i18n.t('common.success.mutation'));
      },
    },
  },
  queryCache: new QueryCache({
    onError: handleQueryError,
  }),
});

export { handleQueryError };
export default queryClient;
