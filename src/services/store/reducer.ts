import { combineReducers } from 'redux';
import { auth, snackbar } from './slices';

const reducers = {
  auth,
  snackbar,
};

export const reducer = combineReducers(reducers);

export type Reducer = typeof reducer;

export type State = ReturnType<Reducer>;

export type Action = Parameters<Reducer>[1];
