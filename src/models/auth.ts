import firebase from 'firebase/app';
import 'firebase/auth';
import { WithId } from './models';

export type User = firebase.UserInfo;

export type UserState = 'loading' | firebase.User | null;
export interface WithUserState {
  user: UserState;
}

export type FirestoreUser = Pick<
  User,
  'displayName' | 'email' | 'phoneNumber' | 'photoURL' | 'providerId'
> &
  WithId & { proMembershipOrder?: string };
