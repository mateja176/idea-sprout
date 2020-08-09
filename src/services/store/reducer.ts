import { combineReducers, Reducer as ReduxReducer } from 'redux';
import { createAction, getType } from 'typesafe-actions';
import { auth } from './slices/auth';
import { ideasSlice } from './slices/ideas';

const reducers = {
  ideasSlice,
  auth,
};

const combinedReducer = combineReducers(reducers);
export const createReset = createAction('reset')();
export type CreateReset = typeof createReset;
export type ResetAction = ReturnType<CreateReset>;
export const initialState = combinedReducer(
  undefined,
  // * the reducer handles unknown actions by returning the current state
  // * which is the initial state at the very beginning the lifecycle
  (createReset() as unknown) as CombinedAction,
);
export const reducer: ReduxReducer<State, Action> = (state, action) =>
  action.type === getType(createReset)
    ? initialState
    : combinedReducer(state, action);

export type Reducer = typeof combinedReducer;

export type State = ReturnType<Reducer>;

export type CombinedAction = Parameters<Reducer>[1];

export type Action = CombinedAction | ResetAction;
