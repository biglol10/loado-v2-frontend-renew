import { throttle } from 'lodash';
import { useCallback, useMemo } from 'react';

export const usePreventMultipleClick = <T extends HTMLElement>(
  disabled = false,
  onClick?: (e: React.MouseEvent<T>) => void,
  use = true,
  timeout = 500
) => {
  /**
   * Creates a throttled version of the onClick handler to prevent multiple rapid clicks
   *
   * This function uses lodash's throttle to limit how often the onClick handler can be triggered:
   * - If onClick is not provided or disabled is true, returns an empty function
   * - Otherwise, returns a throttled function that executes onClick only once per specified timeout
   *
   * Throttle 옵션:
   * - leading: true - 함수가 제한 시간 내 첫 번째 호출에서 실행됩니다 (타임아웃 기간 내 첫 클릭 시 실행)
   *   예: 사용자가 버튼을 빠르게 여러 번 클릭하면, 첫 번째 클릭만 즉시 처리됩니다.
   * - trailing: false - 함수가 제한 시간이 끝난 후에는 실행되지 않습니다 (타임아웃 기간 이후 추가 실행 안 함)
   *   예: 타임아웃 기간(500ms) 동안 추가 클릭이 있어도 마지막 클릭은 별도로 처리되지 않습니다.
   *
   * This prevents multiple rapid clicks from triggering the handler multiple times.
   */
  const debounceClick = useCallback(
    (onClick?: (e: React.MouseEvent<T>) => void) => {
      if (!onClick || disabled) return () => {};

      return throttle(
        (e: React.MouseEvent<T>) => {
          if (disabled) return;
          onClick(e);
        },
        timeout,
        { leading: true, trailing: false }
      );
    },
    [disabled, timeout]
  );

  const onClickHandler = useMemo(() => {
    if (disabled || !onClick) return undefined;

    return use ? debounceClick(onClick) : onClick;
  }, [disabled, onClick, use, debounceClick]);

  return {
    onClickHandler,
    debounceClick,
  };
};
