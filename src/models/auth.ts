import firebase from 'firebase/app';
import 'firebase/auth';

export type User = firebase.UserInfo;

export const initialUser: User = {
  uid: '',
  displayName: null,
  email: null,
  phoneNumber: null,
  photoURL: null,
  providerId: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
};
