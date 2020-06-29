import firebase from 'firebase/app';
import 'firebase/firestore';
import { OrderedMap } from 'immutable';
import { IdeaFilter, IdeaModel, RawIdea } from 'models';
import { ThunkAction } from 'redux-thunk';
import { ideasFetchLimit } from 'utils';
import { Action, State } from '../reducer';
import { ConcatIdeasAction, createConcatIdeas, selectIdeas } from '../slices';

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
  extends IdeaFilter<Key> {
  orderByField?: Key;
  directionStr?: firebase.firestore.OrderByDirection;
}

export const createFetchIdeas = <Key extends keyof IdeaModel>({
  fieldPath,
  opStr,
  value,
  orderByField = 'createdAt' as Key,
  directionStr = 'desc',
}: FetchIdeasOptions<Key>): ThunkAction<
  Promise<ConcatIdeasAction>,
  State,
  void,
  Action
> => (dispatch) => {
  return firebase
    .firestore()
    .collection('ideas')
    .where(fieldPath, opStr, value)
    .orderBy(orderByField, directionStr)
    .get()
    .then(({ docs }) =>
      dispatch(
        createConcatIdeas(
          OrderedMap(
            Object.fromEntries(
              docs.map((doc) => [doc.id, doc.data()]),
            ) as Record<IdeaModel['id'], RawIdea>,
          ),
        ),
      ),
    );
};

export interface FetchMoreIdeasOptions<Key extends keyof IdeaModel>
  extends FetchIdeasOptions<Key> {
  limit: number;
}

export const createFetchMoreIdeas = <Key extends keyof IdeaModel>({
  fieldPath,
  opStr,
  value,
  orderByField = 'createdAt' as Key,
  directionStr = 'desc',
  limit = ideasFetchLimit,
}: FetchMoreIdeasOptions<Key>): ThunkAction<
  Promise<ConcatIdeasAction>,
  State,
  void,
  Action
> => (dispatch, getState) => {
  const lastCreatedAt = selectIdeas(getState()).last<RawIdea>().createdAt;

  return firebase
    .firestore()
    .collection('ideas')
    .where(fieldPath, opStr, value)
    .orderBy(orderByField, directionStr)
    .startAt(lastCreatedAt)
    .limit(limit)
    .get()
    .then(({ docs }) =>
      dispatch(
        createConcatIdeas(
          OrderedMap(
            Object.fromEntries(
              docs.map((doc) => [doc.id, doc.data()]),
            ) as Record<IdeaModel['id'], RawIdea>,
          ),
        ),
      ),
    );
};
