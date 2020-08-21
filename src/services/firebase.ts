import firebase from 'firebase/app';
import { GlobalWithReactfire } from 'types/firebase';

export const interceptGetIdeasError = (
  snapshot: firebase.firestore.QuerySnapshot,
) => {
  if (snapshot.empty && snapshot.metadata.fromCache) {
    throw new Error('Failed to fetch ideas');
  }
  return snapshot;
};

export const clearFirestoreCache = () => {
  const map = (globalThis as GlobalWithReactfire)
    ._reactFirePreloadedObservables;
  if (map) {
    Array.from(map.keys()).forEach(
      (key) => key.includes('firestore') && map.delete(key),
    );
  }
};

export const withFirestore = <Param>(param: Param) =>
  firebase.firestore === undefined
    ? import(/* webpackChunkName: "Firestore" */ 'firebase/firestore').then(
        () => param,
      )
    : Promise.resolve(param);
