import { combineEpics } from 'redux-observable';
import { ideas } from './ideas';

export const epic = combineEpics(...Object.values(ideas));
