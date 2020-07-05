import { Action as ReduxAction, AnyAction, Middleware } from 'redux';
import { createAction } from 'typesafe-actions';
import { Action } from '../reducer';

export const createPromisedAction = createAction(
  'promisedAction/subscribe',
  (
    payload: ReduxAction<Action['type']> & {
      callback: (action: Action) => void;
    },
  ) => payload,
)();
export type CreatePromisedAction = typeof createPromisedAction;
export type PromisedAction = ReturnType<CreatePromisedAction>;

const queue: Partial<Record<
  PromisedAction['payload']['type'],
  PromisedAction['payload']['callback'][]
>> = {};

export function isPromisedAction(action: AnyAction): action is PromisedAction {
  return (
    typeof action.payload?.type === 'string' &&
    typeof action.payload?.callback === 'function'
  );
}

export const promiseMiddleware: Middleware = () => (next) => (action) => {
  if (isPromisedAction(action)) {
    if (queue[action.payload.type]) {
      queue[action.payload.type]!.push(action.payload.callback);
    } else {
      queue[action.payload.type] = [];
      queue[action.payload.type]!.push(action.payload.callback);
    }
  } else {
    const type = action.type as PromisedAction['payload']['type'];
    if (queue[type]) {
      queue[type]!.forEach((callback) => {
        callback(action);
      });

      queue[type] = [];
    }

    return next(action);
  }
};
