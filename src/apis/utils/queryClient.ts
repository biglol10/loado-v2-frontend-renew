import { QueryCache, QueryClient } from '@tanstack/react-query';
import i18n from '@/locales/i18n';
import { showErrorToast, showSuccessToast } from '@/utils/toastUtils';

export const getQueryClient = (handleError: any) => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
        staleTime: 5 * 60 * 1000, // 5분 동안 데이터를 신선한 상태로 유지
        gcTime: 10 * 60 * 1000, // 10분 동안 미사용 데이터를 메모리에 유지
        throwOnError: false,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 0,
        throwOnError: false,
        onError: (error: any) => {
          // queries와 동일한 에러 처리
          if (error.message === 'Network Error') {
            showErrorToast(i18n.t('common.error.network'));
            return;
          }

          if (error.response?.status) {
            showErrorToast(i18n.t('common.error.api'));
            return;
          }

          showErrorToast(i18n.t('common.error.unknown'));
        },
        onSuccess: () => {
          showSuccessToast(i18n.t('common.success.mutation'));
        },
      },
    },
    queryCache: new QueryCache({
      onError: handleError,
    }),
  });
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      staleTime: 5 * 60 * 1000, // 5분 동안 데이터를 신선한 상태로 유지
      gcTime: 10 * 60 * 1000, // 10분 동안 미사용 데이터를 메모리에 유지
      throwOnError: false,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
      throwOnError: false,
      onError: (error: any) => {
        // queries와 동일한 에러 처리
        if (error.message === 'Network Error') {
          showErrorToast(i18n.t('common.error.network'));
          return;
        }

        if (error.response?.status) {
          showErrorToast(i18n.t('common.error.api'));
          return;
        }

        showErrorToast(i18n.t('common.error.unknown'));
      },
      onSuccess: () => {
        showSuccessToast(i18n.t('common.success.mutation'));
      },
    },
  },
});

export default queryClient;
