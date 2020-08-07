import { combineEpics } from 'redux-observable';
import { auth } from './auth';
import { ideas } from './ideas';

export const epic = combineEpics(
  ...Object.values(ideas),
  ...Object.values(auth),
);
