import axios, { AxiosError } from 'axios';
import { useCallback, useMemo } from 'react';
import { showErrorToast } from '../toastUtils';
import { useTranslation } from 'react-i18next';

// 참고: https://github.com/FESP-TEAM-1/beta-frontend
// React query error
const useHandleError = () => {
  const { t } = useTranslation();

  const statusHandlers = useMemo(
    () => ({
      500: () => showErrorToast(t('common.error.server')),
      default: () => showErrorToast(t('common.error.unknown')),
    }),
    [t]
  );

  const handleError = useCallback(
    (error: unknown) => {
      // 얘는 잘 안 먹힘
      if (!navigator.onLine) {
        showErrorToast(t('common.error.network'));
        return;
      }

      if (axios.isAxiosError(error)) {
        if (error.response) {
          const axiosError = error as AxiosError;
          const httpStatus = axiosError.response?.status; // 500
          const errorResponse = axiosError.response?.data; // { message: '서버 에러가 발생했습니다' }
          const httpMessage = axiosError.message; // 'Simulated API Error'
          const httpErrorCode = axiosError.code; // 'ECONNABORTED'

          if (httpStatus === 500) {
            showErrorToast(t('common.error.server'));
          } else {
            showErrorToast(t('common.error.unknown'));
          }

          // const handle = statusHandlers[httpStatus as keyof typeof statusHandlers] || statusHandlers.default;

          // handle();
          return;
        }
      } else {
        showErrorToast(t('common.error.unknown'));
        return;
      }
    },
    [t]
  );

  return { handleError };
};

export default useHandleError;
