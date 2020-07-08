export const interceptGetIdeasError = (
  snapshot: firebase.firestore.QuerySnapshot,
) => {
  if (snapshot.empty && snapshot.metadata.fromCache) {
    throw new Error('Failed to fetch ideas');
  }
  return snapshot;
};
