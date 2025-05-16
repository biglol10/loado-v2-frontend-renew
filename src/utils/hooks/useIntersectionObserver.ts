import { useCallback, useEffect, useRef } from 'react';

const useIntersectionObserver = (callback: () => void, options: IntersectionObserverInit) => {
  // 최신 콜백 참조를 유지
  const callbackRef = useRef(callback);

  // 콜백이 변경될 때마다 ref 업데이트
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // observer 인스턴스를 지정할 ref
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 컴포넌트 마운트 시 observer 생성
  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // 항상 최신 콜백 사용
          callbackRef.current?.();
        }
      });
    }, options);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [options]);

  // observe, unobserve 메서드 메모이제이션
  const observe = useCallback((element: HTMLElement | null) => {
    if (element && observerRef.current) {
      observerRef.current.observe(element);
    }
  }, []);

  const unobserve = useCallback((element: HTMLElement | null) => {
    if (element && observerRef.current) {
      observerRef.current.unobserve(element);
    }
  }, []);

  return { observe, unobserve };
};

export default useIntersectionObserver;
