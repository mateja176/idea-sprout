import { WithTimeout } from 'models';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ActionCreatorsMapObject, bindActionCreators } from 'redux';
import { Action } from 'services';

export const useActions = <
  ActionCreators extends ActionCreatorsMapObject<Action>
>(
  actionCreators: ActionCreators,
) => {
  const dispatch = useDispatch();

  return bindActionCreators<Action, ActionCreators>(actionCreators, dispatch);
};

export const useDeferredValue = <Value>(
  value: Value,
  { timeoutMs }: WithTimeout,
) => {
  const [deferredValue, setDeferredValue] = useState<Value>(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDeferredValue(value);
    }, timeoutMs);

    return () => {
      clearTimeout(timeout);
    };
  }, [timeoutMs, value]);

  return deferredValue;
};

export const useValueWithFallback: typeof useDeferredValue = (
  value,
  suspenseConfig,
) => {
  const deferredValue = useDeferredValue(value, suspenseConfig);

  return {
    ...value,
    ...deferredValue,
  };
};

export const useTransition = ({ timeoutMs }: WithTimeout) => {
  const [isPending, setIsPending] = useState(false);

  const startTransition = useCallback(
    (callback: () => void) => {
      setIsPending(true);
      const timeout = setTimeout(() => {
        callback();

        setIsPending(false);
      }, timeoutMs);

      return () => {
        clearTimeout(timeout);
      };
    },
    [timeoutMs],
  );

  return [startTransition, isPending] as const;
};
