import { User } from 'firebase';
import { initialUser, User as UserModel } from 'models';

export const getIsLoading = (user: UserModel | null) =>
  user?.uid === initialUser.uid;

export const getIsSignedIn = (user: UserModel | null) =>
  !!user && isFirebaseUser(user) && user.emailVerified;

export function isInitialUser(user: User | UserModel): user is UserModel {
  return user.uid === initialUser.uid;
}

export function isFirebaseUser(user: User | UserModel): user is User {
  return !!user.uid;
}
