import { User } from 'firebase';
import { initialUser } from 'models';

export function isFirebaseUser(user: User | typeof initialUser): user is User {
  return !!user.uid;
}
