import { FileDimensions } from 'models';
import {
  SuspenseConfig,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';
import { ActionCreatorsMapObject, bindActionCreators } from 'redux';
import { Action, AnyThunk, GetBoundThunk } from 'services';

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

export const useThunkActions = <
  ThunkActionCreators extends Record<string, AnyThunk>
>(
  thunkActionCreators: ThunkActionCreators,
) => {
  const dispatch = useDispatch();

  return bindActionCreators(thunkActionCreators as any, dispatch) as {
    [key in keyof ThunkActionCreators]: GetBoundThunk<ThunkActionCreators[key]>;
  };
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

export const useComputedHeight = ({ width, height }: FileDimensions) => {
  const [computedHeight, setComputedHeight] = useState(height);

  useEffect(() => {
    const handleResize = () => {
      if (document.body.clientWidth < width) {
        setComputedHeight((height * document.body.clientWidth) / width);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [height, width]);

  return computedHeight;
};

export const useFileDimensions = ({ width, height }: FileDimensions) => {
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });

  useEffect(() => {
    const handleResize = () => {
      const ratio = Math.min(
        window.innerWidth / width,
        window.innerHeight / height,
      );

      setDimensions({
        width: width * ratio,
        height: height * ratio,
      });
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [width, height]);

  return dimensions;
};
