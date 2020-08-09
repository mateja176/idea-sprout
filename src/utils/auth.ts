import { User } from 'firebase';
import { UserState } from 'models/auth';

export function isUserLoading(user: UserState): user is 'loading' {
  return user === 'loading';
}

export const getIsSignedIn = (user: UserState) =>
  !!user && isFirebaseUser(user) && user.emailVerified;

export function isFirebaseUser(user: UserState): user is User {
  return !isUserLoading(user) && !!user;
}
