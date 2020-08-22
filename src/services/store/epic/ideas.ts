import firebase, { FirebaseError } from 'firebase/app';
import findLast from 'ramda/es/findLast';
import { Epic, ofType } from 'redux-observable';
import { defer, of } from 'rxjs';
import { catchError, concatMap, first, map, mergeMap } from 'rxjs/operators';
import { getType } from 'typesafe-actions';
import { IdeaSprout } from '../../../models/idea';
import {
  interceptGetIdeasError,
  withFirestore,
} from '../../../services/firebase';
import { Action, State } from '../../../services/store/reducer';
import {
  convertFirestoreDocument,
  firestoreCollections,
} from '../../../utils/firebase';
import { isIdea } from '../../../utils/idea/idea';
import {
  fetchIdeasAsync,
  FetchIdeasFailure,
  FetchIdeasRequest,
  FetchIdeasSuccess,
  selectIdeas,
} from '../slices/ideas';

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
          concatMap((lastIdea) => {
            return withFirestore(lastIdea);
          }),
          mergeMap((lastIdea) =>
            defer(() =>
              firebase
                .firestore()
                .collection(firestoreCollections.ideas.path)
                .where(fieldPath, opStr, value)
                .orderBy(orderByField, directionStr)
                .startAfter(isIdea(lastIdea) ? lastIdea.createdAt : '')
                .limit(limit)
                .get(),
            ).pipe(
              map(interceptGetIdeasError),
              map(({ docs }) =>
                fetchIdeasAsync.success({
                  startIndex,
                  ideas: docs.map((doc) =>
                    convertFirestoreDocument<IdeaSprout>(doc),
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
