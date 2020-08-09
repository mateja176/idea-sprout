import { FirebaseError } from 'firebase';
import { User } from 'models/auth';
import { createSelector } from 'reselect';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

export const initialAuthState = {
  emailVerified: false,
};
export type AuthState = typeof initialAuthState;

export const createSaveUser = createAsyncAction(
  'auth/saveUser/request',
  'auth/saveUser/success',
  'auth/saveUser/failure',
)<User, void, FirebaseError>();
export type CreateSaveUser = typeof createSaveUser;
export type SaveUserAction = ActionType<CreateSaveUser>;
export type SaveUserRequest = ReturnType<CreateSaveUser['request']>;
export type SaveUserSuccess = ReturnType<CreateSaveUser['success']>;
export type SaveUserFailure = ReturnType<CreateSaveUser['failure']>;

export const createSetEmailVerified = createAction(
  'auth/emailVerified/set',
  (payload: AuthState['emailVerified']) => payload,
)();
export type CreateSetEmailVerified = typeof createSetEmailVerified;
export type SetEmailVerifiedAction = ReturnType<CreateSetEmailVerified>;

export type AuthAction = SaveUserAction | SetEmailVerifiedAction;

export const auth = (
  state = initialAuthState,
  action: AuthAction,
): AuthState => {
  switch (action.type) {
    case 'auth/emailVerified/set':
      return { ...state, emailVerified: action.payload };
    default:
      return state;
  }
};

export const selectAuth = ({ auth }: { auth: AuthState }) => auth;
export const selectEmailVerified = createSelector(
  selectAuth,
  ({ emailVerified }) => emailVerified,
);
