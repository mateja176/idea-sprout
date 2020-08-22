import firebase from 'firebase/app';
import equals from 'ramda/es/equals';
import { WithId } from '../models/models';

export const firestoreCollections = {
  users: {
    path: 'users',
    collections: {},
  },
  ideas: {
    path: 'ideas',
    collections: { reviews: { path: 'reviews' } },
  },
  counts: {
    path: 'counts',
    collections: {},
  },
  orders: {
    path: 'orders',
    collections: {},
  },
};

export const convertFirestoreDocument = <T extends WithId>(
  doc: firebase.firestore.DocumentSnapshot | T,
): T =>
  doc instanceof firebase.firestore.DocumentSnapshot
    ? ({
        ...(doc.data() as Omit<T, 'id'>),
        id: doc.id,
      } as T)
    : doc;

export const convertFirestoreCollection = <T extends WithId>(
  collection: firebase.firestore.QuerySnapshot | T[],
): T[] => {
  return collection instanceof firebase.firestore.QuerySnapshot
    ? collection.docs.map((doc) => convertFirestoreDocument<T>(doc))
    : collection;
};

export function hasOnlyId(o: {}): o is WithId {
  return equals(Object.keys(o), ['id']);
}
