import { FirebaseError } from 'firebase';
import { User } from 'models';
import { ActionType, createAsyncAction } from 'typesafe-actions';

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

export type AuthAction = SaveUserAction;
