import {
  SuspenseConfig,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';
import { ActionCreatorsMapObject, bindActionCreators } from 'redux';
import { getOrigin } from '../services/services';
import {
  LocalStorageItems,
  LocalStorageKey,
  storage,
} from '../services/storage';
import { Action } from '../services/store/reducer';

export const useOrigin = () => {
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(getOrigin());
  }, []);

  return origin;
};

export const useLocalStorageSubscribe = (key: LocalStorageKey) => {
  const [value, setValue] = useState<LocalStorageItems[typeof key] | null>(
    null,
  );

  useEffect(() => {
    const unsubscribe = storage.subscribe(key, (_, value) => {
      setValue(value);
    });

    return unsubscribe;
  }, [key]);

  return value;
};

export const useLocalStorageGet = <Key extends LocalStorageKey>(key: Key) => {
  const [item, setItem] = useState<LocalStorageItems[Key] | null>(null);

  useEffect(() => {
    setItem(storage.getItem(key));
  }, [key]);

  return item;
};

export const useLocalStorageSet = (key: LocalStorageKey) => {
  return (value: LocalStorageItems[typeof key]) => {
    storage.setItem(key, value);
  };
};

export const useLocalStorageItem = <Key extends LocalStorageKey>(key: Key) => {
  return { value: useLocalStorageGet(key), set: useLocalStorageSet(key) };
};

export const useLocalStorageRemove = () => {
  return (key: LocalStorageKey) => {
    storage.removeItem(key);
  };
};

export const useRetry = <A, B>({
  request,
  maxAttempts,
  onError,
}: {
  request: (...params: A[]) => Promise<B>;
  maxAttempts: number;
  onError: (error: Error) => void;
}) => {
  // * state is not an option since the reference changes
  const retryCountRef = useRef(1);

  const retry = useCallback(
    (...params: A[]) => (error: Error) => {
      if (retryCountRef.current <= maxAttempts) {
        retryCountRef.current += 1;

        setTimeout(() => {
          request(...params).catch(retry(...params));
        }, 1000 * retryCountRef.current);
      } else {
        onError(error);
      }
    },
    [request, maxAttempts, onError],
  );

  return (...params: A[]) => request(...params).catch(retry(...params));
};

export const useActions = <
  ActionCreators extends ActionCreatorsMapObject<Action>
>(
  actionCreators: ActionCreators,
) => {
  const dispatch = useDispatch();

  return useMemo(
    () => bindActionCreators<Action, ActionCreators>(actionCreators, dispatch),
    [actionCreators, dispatch],
  );
};

export const useDeferredValue = <Value>(
  value: Value,
  { timeoutMs }: SuspenseConfig,
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
    ...deferredValue,
    ...value,
  };
};

export const useBooleanWithFallback = (
  value: boolean,
  { timeoutMs }: SuspenseConfig,
) => {
  const [valueWithFallback, setValueWithFallback] = useState(value);

  useEffect(() => {
    const timeout = (() => {
      if (value) {
        return setValueWithFallback(true);
      } else {
        return setTimeout(() => {
          setValueWithFallback(false);
        }, timeoutMs);
      }
    })();
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [timeoutMs, value]);

  return valueWithFallback;
};

export const useTransition = ({ timeoutMs }: SuspenseConfig) => {
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
