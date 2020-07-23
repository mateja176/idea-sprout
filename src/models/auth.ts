import firebase from 'firebase/app';
import 'firebase/auth';
import { WithId } from './models';

export type User = firebase.UserInfo;

export const initialUser: User = {
  uid: '',
  displayName: null,
  email: null,
  phoneNumber: null,
  photoURL: null,
  providerId: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
};

export type FirestoreUser = Pick<
  User,
  'displayName' | 'email' | 'phoneNumber' | 'photoURL' | 'providerId'
> &
  WithId & { proMembershipOrder?: string };
