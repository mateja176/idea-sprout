import firebase from 'firebase/app';
import 'firebase/firestore';
import { IdeaFilter, IdeaModel } from 'models';
import { last, range } from 'ramda';
import { IndexRange } from 'react-virtualized';
import { ThunkAction } from 'redux-thunk';
import { getIdeasRef } from 'services/hooks';
import { convertFirestoreCollection } from 'utils';
import { Action, State } from '../reducer';
import {
  createConcatIdeas,
  createUpdateIdeas,
  selectIdeas,
  UpdateIdeasAction,
} from '../slices';

export type AnyThunk = (
  ...params: any[]
) => ThunkAction<Promise<any>, State, void, Action>;

export type GetBoundThunk<T extends AnyThunk> = (
  ...params: Parameters<T>
) => ReturnType<ReturnType<T>>;

export type GetActionCreator<T extends AnyThunk> = GetBoundThunk<T> extends (
  ...params: any[]
) => Promise<infer A>
  ? (...params: Parameters<T>) => A
  : never;

export interface FetchIdeasOptions<Key extends keyof IdeaModel>
  extends IdeaFilter<Key>,
    IndexRange {
  orderByField?: Key;
  directionStr?: firebase.firestore.OrderByDirection;
}

export const createFetchIdeas = <Key extends keyof IdeaModel>({
  fieldPath,
  opStr,
  value,
  startIndex,
  stopIndex,
  orderByField = 'createdAt' as Key,
  directionStr = 'desc',
}: FetchIdeasOptions<Key>): ThunkAction<
  Promise<UpdateIdeasAction>,
  State,
  void,
  Action
> => (dispatch) => {
  const limit = stopIndex - startIndex;

  dispatch(
    createConcatIdeas({
      ideas: range(0, limit).map(() => 'loading'),
    }),
  );

  return getIdeasRef()
    .where(fieldPath, opStr, value)
    .orderBy(orderByField, directionStr)
    .get()
    .then((snapshot) => convertFirestoreCollection<IdeaModel>(snapshot))
    .then((ideas) => {
      return dispatch(createUpdateIdeas({ startIndex, stopIndex, ideas }));
    });
};

export const createFetchMoreIdeas = <Key extends keyof IdeaModel>({
  fieldPath,
  opStr,
  value,
  startIndex,
  stopIndex,
  orderByField = 'createdAt' as Key,
  directionStr = 'desc',
}: FetchIdeasOptions<Key>): ThunkAction<
  Promise<UpdateIdeasAction>,
  State,
  void,
  Action
> => (dispatch, getState) => {
  const limit = stopIndex - startIndex;

  dispatch(
    createConcatIdeas({
      ideas: range(0, limit).map(() => 'loading'),
    }),
  );

  const lastCreatedAt = last(selectIdeas(getState()));

  return getIdeasRef()
    .where(fieldPath, opStr, value)
    .orderBy(orderByField, directionStr)
    .startAt(lastCreatedAt)
    .limit(limit)
    .get()
    .then((snapshot) => convertFirestoreCollection<IdeaModel>(snapshot))
    .then((ideas) => {
      return dispatch(createUpdateIdeas({ startIndex, stopIndex, ideas }));
    });
};
