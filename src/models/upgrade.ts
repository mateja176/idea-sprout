import firebase, { User } from 'firebase/app';
import { WithId } from './models';

export const currency = 'USD';

export type WithValue = { value: number };

export interface Order {
  id: User['uid'];
  orderId: WithId['id'];
  createdAt: firebase.firestore.Timestamp;
}

export type Upgrade = (params: {
  orderId: string;
}) => Promise<firebase.functions.HttpsCallableResult>;
