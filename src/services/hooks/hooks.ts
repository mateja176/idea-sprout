import { useDispatch } from 'react-redux';
import { ActionCreatorsMapObject, bindActionCreators } from 'redux';
import { Action } from 'services';
import { useState, useEffect } from 'react';

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
  { timeoutMs }: { timeoutMs: number },
) => {
  const [deferredValue, setDeferredValue] = useState<Value>(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDeferredValue(value);
    }, timeoutMs);

    return () => {
      clearTimeout(timeout);
    }
  }, [timeoutMs, value]);

  return deferredValue;
};
