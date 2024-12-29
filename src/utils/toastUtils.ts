import { toast } from 'react-hot-toast';

// 디바운스된 토스트를 위한 유틸리티
let errorToastTimeout: NodeJS.Timeout | null = null;
let successToastTimeout: NodeJS.Timeout | null = null;

const timeoutTime = 100;

export const showErrorToast = (message: string) => {
  if (errorToastTimeout) {
    clearTimeout(errorToastTimeout);
  }

  errorToastTimeout = setTimeout(() => {
    toast.error(message, {
      position: 'bottom-center',
      duration: 3000,
    });
    errorToastTimeout = null;
  }, timeoutTime); // 100ms 디바운스
};

export const showSuccessToast = (message: string) => {
  if (successToastTimeout) {
    clearTimeout(successToastTimeout);
  }

  successToastTimeout = setTimeout(() => {
    toast.success(message, {
      position: 'bottom-center',
      duration: 3000,
    });
    successToastTimeout = null;
  }, timeoutTime); // 100ms 디바운스
};
