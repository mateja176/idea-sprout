import firebase, { User } from 'firebase/app';
import { WithId } from './models';

export const currency = 'USD';

export type WithValue = { value: number };

export interface Order extends WithId {
  userId: User['uid'];
  createdAt: firebase.firestore.Timestamp;
}
