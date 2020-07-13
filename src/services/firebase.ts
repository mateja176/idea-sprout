export const interceptGetIdeasError = (
  snapshot: firebase.firestore.QuerySnapshot,
) => {
  if (snapshot.empty && snapshot.metadata.fromCache) {
    throw new Error('Failed to fetch ideas');
  }
  return snapshot;
};

export const clearFirestoreCache = () => {
  const map = (window as any)._reactFirePreloadedObservables;
  (Array.from(map.keys()) as string[][]).forEach(
    (key) => key.includes('firestore') && map.delete(key),
  );
};
