import firebase from 'firebase/app';
import 'firebase/firestore';
import { IdeaBatchError, IdeaFilter, IdeaModel } from 'models';
import { last, range } from 'ramda';
import { IndexRange } from 'react-virtualized';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { getIdeasRef } from 'services';
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

interface WithDispatch {
  dispatch: Dispatch<Action>;
}

interface WithGetState {
  getState: () => State;
}

const getRange = (limit: number) => range(0, limit);

const getLimit = ({ startIndex, stopIndex }: IndexRange) =>
  stopIndex - startIndex;

const handleGetIdeasSuccess = ({
  dispatch,
  startIndex,
  stopIndex,
}: IndexRange & WithDispatch & WithGetState) => (ideas: IdeaModel[]) => {
  return dispatch(createUpdateIdeas({ startIndex, ideas }));
};

const handleGetIdeasFailure = ({
  dispatch,
  startIndex,
  stopIndex,
  fieldPath,
  opStr,
  value,
}: IndexRange & WithDispatch & IdeaFilter<keyof IdeaModel>) => (
  error: Error,
) => {
  return dispatch(
    createUpdateIdeas({
      startIndex,
      ideas: getRange(getLimit({ startIndex, stopIndex })).map(
        () =>
          new IdeaBatchError(
            error.message,
            startIndex,
            stopIndex,
            fieldPath,
            opStr,
            value,
          ),
      ),
    }),
  );
};

const interceptGetIdeasError = (snapshot: firebase.firestore.QuerySnapshot) => {
  if (snapshot.empty && snapshot.metadata.fromCache) {
    throw new Error('Failed to fetch ideas');
  }
  return snapshot;
};
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
> => (dispatch, getState) => {
  const limit = getLimit({ startIndex, stopIndex });

  const lastIdea = last(selectIdeas(getState()));

  dispatch(
    createConcatIdeas({
      ideas: getRange(limit).map(() => 'loading'),
    }),
  );

  return getIdeasRef()
    .where(fieldPath, opStr, value)
    .orderBy(orderByField, directionStr)
    .startAfter(lastIdea ? (lastIdea as IdeaModel).createdAt : '')
    .limit(limit)
    .get()
    .then(interceptGetIdeasError)
    .then((snapshot) => convertFirestoreCollection<IdeaModel>(snapshot))
    .then(handleGetIdeasSuccess({ dispatch, getState, startIndex, stopIndex }))
    .catch(
      handleGetIdeasFailure({
        dispatch,
        startIndex,
        stopIndex,
        fieldPath,
        opStr,
        value,
      }),
    );
};
