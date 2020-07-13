import { combineReducers, Reducer as ReduxReducer } from 'redux';
import { createAction, getType } from 'typesafe-actions';
import { ideasSlice, snackbar } from './slices';

const reducers = {
  snackbar,
  ideasSlice,
};

const combinedReducer = combineReducers(reducers);
export const createReset = createAction('reset')();
export type CreateReset = typeof createReset;
export type ResetAction = ReturnType<CreateReset>;
export const initialState = combinedReducer(undefined, createReset() as any);
export const reducer: ReduxReducer<State, Action> = (state, action) =>
  action.type === getType(createReset)
    ? initialState
    : combinedReducer(state, action);

export type Reducer = typeof combinedReducer;

export type State = ReturnType<Reducer>;

export type CombinedAction = Parameters<Reducer>[1];

export type Action = CombinedAction | ResetAction;
