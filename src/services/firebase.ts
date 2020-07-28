export const interceptGetIdeasError = (
  snapshot: firebase.firestore.QuerySnapshot,
) => {
  if (snapshot.empty && snapshot.metadata.fromCache) {
    throw new Error('Failed to fetch ideas');
  }
  return snapshot;
};

export const clearFirestoreCache = () => {
  const map = window._reactFirePreloadedObservables;
  if (map) {
    Array.from(map.keys()).forEach(
      (key) => key.includes('firestore') && map.delete(key),
    );
  }
};
