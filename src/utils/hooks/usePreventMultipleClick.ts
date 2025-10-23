import { useCallback, useEffect, useRef } from 'react';
import { throttle } from 'lodash';

interface UseThrottledClickOptions {
  /**
   * Whether the click handler is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Throttle timeout in milliseconds
   * @default 500
   */
  timeout?: number;

  /**
   * Throttle options
   * @default { leading: true, trailing: false }
   */
  options?: {
    leading?: boolean;
    trailing?: boolean;
  };
}

/**
 * Custom hook to prevent multiple rapid clicks using throttle
 *
 * This hook creates a throttled version of the provided click handler to prevent
 * multiple rapid clicks from triggering the handler multiple times. It properly
 * manages cleanup to prevent memory leaks and handles dependency changes correctly.
 *
 * @example
 * ```tsx
 * const handleClick = useThrottledClick((e) => {
 *   console.log('Clicked!', e);
 * }, { timeout: 1000 });
 *
 * return <button onClick={handleClick}>Click me</button>;
 * ```
 *
 * @example
 * ```tsx
 * const handleClick = useThrottledClick(
 *   (e) => submitForm(e),
 *   {
 *     disabled: isSubmitting,
 *     timeout: 1000,
 *     options: { leading: true, trailing: false }
 *   }
 * );
 * ```
 *
 * @param callback - The click handler to throttle
 * @param options - Throttle configuration options
 * @returns Throttled click handler that automatically cleans up on unmount, or undefined if disabled/no callback
 *
 * @remarks
 * - Automatically cancels pending throttled calls on unmount to prevent memory leaks
 * - Returns undefined when disabled or callback is not provided for cleaner API
 * - Uses leading: true, trailing: false by default (executes on first click, ignores subsequent clicks within timeout)
 */
export const useThrottledClick = <T extends HTMLElement>(
  callback?: (e: React.MouseEvent<T>) => void,
  options: UseThrottledClickOptions = {}
) => {
  const {
    disabled = false,
    timeout = 500,
    options: throttleOptions = { leading: true, trailing: false },
  } = options;

  // Store the throttled function in a ref to maintain reference stability
  const throttledFnRef = useRef<ReturnType<typeof throttle> | null>(null);

  // Development mode warnings
  if (process.env.NODE_ENV === 'development') {
    if (timeout < 100) {
      console.warn(
        '[useThrottledClick] Timeout less than 100ms may not be effective for preventing multiple clicks'
      );
    }
  }

  // Extract throttle options for stable dependencies
  const { leading = true, trailing = false } = throttleOptions;

  // Create throttled function only when callback or timeout changes
  useEffect(() => {
    if (!callback || disabled) {
      throttledFnRef.current = null;
      return;
    }

    throttledFnRef.current = throttle(
      (e: React.MouseEvent<T>) => {
        callback(e);
      },
      timeout,
      { leading, trailing }
    );

    // Cleanup: cancel pending throttled calls on unmount or when deps change
    // This prevents memory leaks and ensures no stale callbacks are executed
    return () => {
      throttledFnRef.current?.cancel();
      throttledFnRef.current = null;
    };
  }, [callback, disabled, timeout, leading, trailing]);

  // Return stable callback reference
  const handleClick = useCallback(
    (e: React.MouseEvent<T>) => {
      if (disabled || !throttledFnRef.current) {
        return;
      }
      throttledFnRef.current(e);
    },
    [disabled]
  );

  // Return undefined when disabled or no callback for cleaner API usage
  return disabled || !callback ? undefined : handleClick;
};

/**
 * @deprecated Use `useThrottledClick` instead. This alias is provided for backwards compatibility.
 *
 * Legacy hook name that incorrectly referred to throttling as "debouncing".
 * The implementation uses throttle, not debounce.
 *
 * @param disabled - Whether the click handler is disabled
 * @param onClick - The click handler to throttle
 * @param use - Whether to apply throttling (deprecated parameter)
 * @param timeout - Throttle timeout in milliseconds
 *
 * @example Migration
 * ```tsx
 * // Before (legacy API)
 * const { onClickHandler } = usePreventMultipleClick(disabled, onClick, true, 500);
 *
 * // After (recommended)
 * const onClickHandler = useThrottledClick(onClick, { disabled, timeout: 500 });
 * ```
 */
export const usePreventMultipleClick = <T extends HTMLElement>(
  disabled = false,
  onClick?: (e: React.MouseEvent<T>) => void,
  use = true,
  timeout = 500
) => {
  const onClickHandler = useThrottledClick(onClick, {
    disabled: disabled || !use,
    timeout,
  });

  // Return object format for backwards compatibility
  return {
    onClickHandler,
    /**
     * @deprecated This property is no longer needed and will be removed in future versions
     */
    debounceClick: () => onClickHandler,
  };
};
