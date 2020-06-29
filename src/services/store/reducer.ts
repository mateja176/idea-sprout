import { combineReducers } from 'redux';
import { ideasSlice, snackbar } from './slices';

const reducers = {
  snackbar,
  ideasSlice,
};

export const reducer = combineReducers(reducers);

export type Reducer = typeof reducer;

export type State = ReturnType<Reducer>;

export type Action = Parameters<Reducer>[1];
