import firebase from 'firebase/app';
import { WithId } from 'models';
import { equals } from 'ramda';

export const firestoreCollections = {
  ideas: {
    path: 'ideas',
    collections: { reviews: { path: 'reviews' } },
  },
  counts: {
    path: 'counts',
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
