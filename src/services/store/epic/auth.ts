import firebase from 'firebase/app';
import 'firebase/auth';
import { authProviders } from 'models';
import { Epic, ofType } from 'redux-observable';
import { authState } from 'rxfire/auth';
import { from, of } from 'rxjs';
import { AjaxError } from 'rxjs/ajax';
import {
  catchError,
  exhaustMap,
  map,
  mergeMap,
  switchMap,
} from 'rxjs/operators';
import { getType } from 'typesafe-actions';
import { Action, State } from '../reducer';
import {
  AuthStateChangeFailure,
  AuthStateChangeRequest,
  AuthStateChangeSuccess,
  createAuthStateChange,
  createQueueSnackbar,
  createSignin,
  createSignout,
  QueueSnackbarAction,
  SigninFailure,
  SigninRequest,
  SignoutFailure,
  SignoutRequest,
  SignoutSuccess,
} from '../slices';

export type SigninEpic = Epic<
  Action,
  SigninFailure | QueueSnackbarAction,
  State
>;
export const signin = ((action$) =>
  action$.pipe(
    ofType<Action, SigninRequest>(getType(createSignin.request)),
    exhaustMap(({ payload }) =>
      from(firebase.auth().signInWithPopup(authProviders[payload])).pipe(
        map(({ user }) =>
          createQueueSnackbar({
            message: `Welcome ${user?.displayName ?? ''}`,
            severity: 'success',
          }),
        ),
        catchError((error: AjaxError) =>
          of(
            createSignin.failure(error),
            createQueueSnackbar({ message: error.message, severity: 'error' }),
          ),
        ),
      ),
    ),
  )) as SigninEpic;

export type AuthStateEpic = Epic<
  Action,
  AuthStateChangeSuccess | AuthStateChangeFailure | QueueSnackbarAction,
  State
>;
export const authStateChange: AuthStateEpic = (action$) =>
  action$.pipe(
    ofType<Action, AuthStateChangeRequest>(
      getType(createAuthStateChange.request),
    ),
    switchMap(() =>
      authState(firebase.auth()).pipe(
        map((user) => {
          if (user) {
            return createAuthStateChange.success({ user });
          } else {
            return createAuthStateChange.success({ user: 'initial' });
          }
        }),
        catchError((error: AjaxError) =>
          of(
            createAuthStateChange.failure(error),
            createQueueSnackbar({ message: error.message, severity: 'error' }),
          ),
        ),
      ),
    ),
  );

export type SignoutEpic = Epic<
  Action,
  SignoutSuccess | SignoutFailure | QueueSnackbarAction
>;
export const signout: SignoutEpic = (action$) =>
  action$.pipe(
    ofType<Action, SignoutRequest>(getType(createSignout.request)),
    exhaustMap(() =>
      from(firebase.auth().signOut()).pipe(
        mergeMap(() => [
          createSignout.success(),
          createQueueSnackbar({ message: 'Signed out', severity: 'success' }),
        ]),
        catchError((error: AjaxError) =>
          of(
            createSignout.failure(error),
            createQueueSnackbar({ message: error.message, severity: 'error' }),
          ),
        ),
      ),
    ),
  );

export const auth: Epic[] = [signin, authStateChange, signout];
