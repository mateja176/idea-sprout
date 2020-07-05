import firebase, { FirebaseError } from 'firebase/app';
import 'firebase/firestore';
import { IdeaModel } from 'models';
import { last } from 'ramda';
import { Epic, ofType } from 'redux-observable';
import { collection } from 'rxfire/firestore';
import { of } from 'rxjs';
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import { Action, State } from 'services';
import { getType } from 'typesafe-actions';
import { convertFirestoreDocument, firestoreCollections } from 'utils';
import {
  createSetTotal,
  fetchIdeasAsync,
  FetchIdeasFailure,
  FetchIdeasRequest,
  FetchIdeasSuccess,
  IdeasState,
  initialIdeasState,
  selectIdeas,
  selectTotal,
  SetTotalAction,
} from '../slices';

export function isIdea(idea: IdeasState['ideas'][number]): idea is IdeaModel {
  return !!idea && idea !== 'loading' && !(idea instanceof Error);
}

export const fetch: Epic<
  Action,
  FetchIdeasSuccess | FetchIdeasFailure | SetTotalAction,
  State
> = (action$, state$) =>
  action$.pipe(
    ofType<Action, FetchIdeasRequest>(getType(fetchIdeasAsync.request)),
    withLatestFrom(state$),
    switchMap(
      ([
        {
          payload: {
            startIndex,
            stopIndex,
            fieldPath,
            opStr,
            value,
            directionStr = 'desc' as firebase.firestore.OrderByDirection,
            orderByField = 'createdAt',
          },
        },
        state,
      ]) => {
        const lastIdea = last(selectIdeas(state));

        const limit = stopIndex - startIndex;

        return collection(
          firebase
            .firestore()
            .collection(firestoreCollections.ideas.path)
            .where(fieldPath, opStr, value)
            .orderBy(orderByField, directionStr)
            .startAt(isIdea(lastIdea) ? lastIdea.createdAt : '')
            .limit(limit),
        ).pipe(
          map((snapshots) => ({
            startIndex,
            stopIndex,
            ideas: snapshots.map((snapshot) =>
              convertFirestoreDocument<IdeaModel>(snapshot),
            ),
          })),
          mergeMap((payload) => {
            const { ideas } = payload;

            if (ideas.length < limit) {
              const total = selectTotal(state);
              return [
                fetchIdeasAsync.success(payload),
                createSetTotal({
                  total:
                    total === initialIdeasState.total
                      ? ideas.length
                      : total + ideas.length,
                }),
              ];
            } else {
              return [fetchIdeasAsync.success(payload)];
            }
          }),
          catchError((error: FirebaseError) =>
            of(fetchIdeasAsync.failure(error)),
          ),
        );
      },
    ),
  );

export const ideas = {
  fetch,
};
