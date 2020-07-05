import firebase, { FirebaseError } from 'firebase/app';
import 'firebase/firestore';
import { IdeaModel } from 'models';
import { last } from 'ramda';
import { Epic, ofType } from 'redux-observable';
import { collection } from 'rxfire/firestore';
import { from, of } from 'rxjs';
import { catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { Action, State } from 'services';
import { getType } from 'typesafe-actions';
import { convertFirestoreDocument, firestoreCollections } from 'utils';
import {
  createSetCount,
  fetchIdeasAsync,
  FetchIdeasFailure,
  FetchIdeasRequest,
  FetchIdeasSuccess,
  IdeasState,
  initialIdeasState,
  selectCount,
  selectIdeas,
  SetCountAction,
} from '../slices';

export function isIdea(idea: IdeasState['ideas'][number]): idea is IdeaModel {
  return !!idea && idea !== 'loading' && !(idea instanceof Error);
}

export const fetch: Epic<
  Action,
  FetchIdeasSuccess | FetchIdeasFailure | SetCountAction,
  State
> = (action$, state$) =>
  action$.pipe(
    ofType<Action, FetchIdeasRequest>(getType(fetchIdeasAsync.request)),
    withLatestFrom(state$),
    mergeMap(
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

        return from(
          collection(
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

              const count = selectCount(state);
              const newCount =
                count === initialIdeasState.count
                  ? ideas.length
                  : count + ideas.length;
              if (newCount !== count && ideas.length < limit) {
                return [
                  fetchIdeasAsync.success(payload),
                  createSetCount({
                    count: newCount,
                  }),
                ];
              } else {
                return [fetchIdeasAsync.success(payload)];
              }
            }),
            catchError((error: FirebaseError) =>
              of(fetchIdeasAsync.failure(error)),
            ),
          ),
        );
      },
    ),
  );

export const ideas = {
  fetch,
};
