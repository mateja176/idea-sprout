import { AsyncState, AuthProviderId, User } from 'models';
import { ActionType, createAsyncAction, getType } from 'typesafe-actions';

export interface AuthState {
  user: AsyncState<User>;
}

export const initialAuthState: AuthState = {
  user: 'initial',
};

export const createSignin = createAsyncAction(
  'auth/signin/request',
  'auth/signin/success',
  'auth/signin/failure',
)<AuthProviderId, Pick<AuthState, 'user'>, Error>();
export type CreateSignIn = typeof createSignin;
export type SigninRequest = ReturnType<CreateSignIn['request']>;
export type SigninSuccess = ReturnType<CreateSignIn['success']>;
export type SigninFailure = ReturnType<CreateSignIn['failure']>;
export type SigninAction = ActionType<CreateSignIn>;

export const createAuthStateChange = createAsyncAction(
  'auth/stateChange/request',
  'auth/stateChange/success',
  'auth/stateChange/failure',
)<void, Pick<AuthState, 'user'>, Error>();
export type CreateAuthStateChange = typeof createAuthStateChange;
export type AuthStateChangeRequest = ReturnType<
  CreateAuthStateChange['request']
>;
export type AuthStateChangeSuccess = ReturnType<
  CreateAuthStateChange['success']
>;
export type AuthStateChangeFailure = ReturnType<
  CreateAuthStateChange['failure']
>;
export type AuthStateChangeAction = ActionType<CreateAuthStateChange>;

export const createSignout = createAsyncAction(
  'auth/signOut/request',
  'auth/signOut/success',
  'auth/signOut/failure',
)<void, void, Error>();
export type CreateSignout = typeof createSignout;
export type SignoutRequest = ReturnType<CreateSignout['request']>;
export type SignoutSuccess = ReturnType<CreateSignout['success']>;
export type SignoutFailure = ReturnType<CreateSignout['failure']>;
export type SignoutAction = ActionType<CreateSignout>;

export type AuthAction = SigninAction | AuthStateChangeAction | SignoutAction;

export const auth = (
  state = initialAuthState,
  action: AuthAction,
): AuthState => {
  switch (action.type) {
    case getType(createSignin.request):
    case getType(createAuthStateChange.request):
    case getType(createSignout.request):
      return { ...state, user: 'loading' };
    case getType(createSignout.success):
      return { ...state, user: 'initial' };
    case getType(createSignin.success):
    case getType(createAuthStateChange.success):
      return { ...state, ...action.payload };
    case getType(createSignin.failure):
    case getType(createAuthStateChange.failure):
    case getType(createSignout.failure):
      return { ...state, user: action.payload };
    default:
      return state;
  }
};
