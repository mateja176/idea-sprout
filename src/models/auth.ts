import firebase from 'firebase/app';
import * as yup from 'yup';
import { WithId } from './models';

export type User = firebase.User;

export type UserState = 'loading' | firebase.User | null;
export interface WithUserState {
  user: UserState;
}
export interface WithMaybeUser {
  user: User | null;
}
export interface WithUser {
  user: User;
}

export type FirestoreUser = Pick<
  User,
  'displayName' | 'email' | 'phoneNumber' | 'photoURL' | 'providerId'
> &
  WithId;

export const providerIds = [
  'password',
  'google.com',
  'facebook.com',
  'twitter.com',
] as const;

export type ProviderIds = typeof providerIds;
export type ProviderId = ProviderIds[number];
export type Provider =
  | typeof firebase.auth.GoogleAuthProvider
  | typeof firebase.auth.FacebookAuthProvider
  | typeof firebase.auth.TwitterAuthProvider;

export const passwordSchema = yup.string().required().min(6);
