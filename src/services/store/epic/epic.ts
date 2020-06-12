import { combineEpics } from 'redux-observable';
import { auth } from './auth';

export const epic = combineEpics(...auth);
