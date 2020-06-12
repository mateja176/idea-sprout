import firebase from 'firebase/app';

export type User = firebase.UserInfo;

export type AuthProviderId = string;

export const authProviders: Record<
  AuthProviderId,
  firebase.auth.AuthProvider
> = {
  [firebase.auth.GoogleAuthProvider
    .PROVIDER_ID]: new firebase.auth.GoogleAuthProvider(),
  [firebase.auth.FacebookAuthProvider
    .PROVIDER_ID]: new firebase.auth.FacebookAuthProvider(),
  [firebase.auth.TwitterAuthProvider
    .PROVIDER_ID]: new firebase.auth.TwitterAuthProvider(),
};
