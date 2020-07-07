import firebase, { FirebaseError } from 'firebase/app';
import 'firebase/firestore';
import { IdeaModel } from 'models';
import { findLast } from 'ramda';
import { Epic, ofType } from 'redux-observable';
import { collection } from 'rxfire/firestore';
import { of } from 'rxjs';
import { catchError, concatMap, first, map, mergeMap } from 'rxjs/operators';
import { Action, State } from 'services';
import { getType } from 'typesafe-actions';
import { convertFirestoreDocument, firestoreCollections } from 'utils';
import {
  fetchIdeasAsync,
  FetchIdeasFailure,
  FetchIdeasRequest,
  FetchIdeasSuccess,
  IdeasState,
  selectIdeas,
} from '../slices';

export function isIdea(idea: IdeasState['ideas'][number]): idea is IdeaModel {
  return !!idea && idea !== 'loading' && !(idea instanceof Error);
}

export const fetch: Epic<
  Action,
  FetchIdeasSuccess | FetchIdeasFailure,
  State
> = (action$, state$) =>
  action$.pipe(
    ofType<Action, FetchIdeasRequest>(getType(fetchIdeasAsync.request)),
    // * startAfter requires the last batch to be loaded before requesting a new one
    concatMap(
      ({
        payload: {
          startIndex,
          stopIndex,
          fieldPath,
          opStr,
          value,
          directionStr = 'desc' as firebase.firestore.OrderByDirection,
          orderByField = 'createdAt',
        },
      }) => {
        const limit = stopIndex - startIndex;

        return state$.pipe(
          map(selectIdeas),
          map(findLast(isIdea)),
          first(), // * avoids multiple requests
          mergeMap((lastIdea) =>
            collection(
              firebase
                .firestore()
                .collection(firestoreCollections.ideas.path)
                .where(fieldPath, opStr, value)
                .orderBy(orderByField, directionStr)
                .startAfter(isIdea(lastIdea) ? lastIdea.createdAt : '')
                .limit(limit),
            ).pipe(
              first(), // * necessary because of concatMap, without it the observable would never complete
              map((snapshots) =>
                fetchIdeasAsync.success({
                  startIndex,
                  ideas: snapshots.map((snapshot) =>
                    convertFirestoreDocument<IdeaModel>(snapshot),
                  ),
                }),
              ),
              catchError((error: FirebaseError) =>
                of(fetchIdeasAsync.failure(error)),
              ),
            ),
          ),
        );
      },
    ),
  );

export const ideas = {
  fetch,
};
