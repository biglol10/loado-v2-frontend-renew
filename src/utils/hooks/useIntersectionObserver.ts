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

  // 인라인 객체(options)를 deps에 그대로 넣으면 매 렌더마다 observer가 재생성된다.
  // 원시값으로 분해해 실제 값이 바뀔 때만 재생성한다.
  const { root, rootMargin, threshold } = options;
  const thresholdKey = JSON.stringify(threshold ?? null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 항상 최신 콜백 사용
            callbackRef.current?.();
          }
        });
      },
      { root, rootMargin, threshold }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root, rootMargin, thresholdKey]);

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
