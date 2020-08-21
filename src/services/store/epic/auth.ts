import firebase from 'firebase/app';
import LogRocket from 'logrocket';
import { Epic, ofType } from 'redux-observable';
import { from } from 'rxjs';
import { concatMap, delay, map, mergeMap, retryWhen } from 'rxjs/operators';
import { withFirestore } from 'services/firebase';
import { GlobalWithDrift } from 'types/drift';
import { getType } from 'typesafe-actions';
import { firestoreCollections } from 'utils/firebase';
import { Action, State } from '../reducer';
import {
  createSaveUser,
  SaveUserAction,
  SaveUserRequest,
} from '../slices/auth';

export const saveUser: Epic<Action, SaveUserAction, State> = (action$) =>
  action$.pipe(
    ofType<Action, SaveUserRequest>(getType(createSaveUser.request)),
    concatMap(({ payload }) => withFirestore(payload)),
    mergeMap(
      ({ uid, email, displayName, phoneNumber, providerId, photoURL }) => {
        if (process.env.NODE_ENV === 'production') {
          LogRocket.identify(uid, {
            ...(email ? { email } : {}),
            ...(displayName ? { displayName } : {}),
          });

          (globalThis as GlobalWithDrift).drift?.identify(uid, {
            displayName,
            email,
            phoneNumber,
            providerId,
          });
        }
        const saveUserPromise = firebase
          .firestore()
          .collection(firestoreCollections.users.path)
          .doc(uid)
          .set(
            {
              email,
              displayName,
              phoneNumber,
              providerId,
              photoURL,
            },
            { merge: true },
          );
        return from(saveUserPromise).pipe(
          retryWhen((error$) => error$.pipe(delay(1000))),
          map(() => createSaveUser.success()),
        );
      },
    ),
  );

export const auth = {
  saveUser,
};
