import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

export const sitemap = functions.https.onCall(async () => {
  const aggregateDoc = await admin
    .firestore()
    .collection('ideas')
    .doc('aggregate')
    .get();

  const idMap = aggregateDoc.data();

  if (!idMap) {
    return new functions.https.HttpsError(
      'internal',
      'Could not get site at this time, please retry later.',
    );
  }

  const ids = Object.keys(idMap);

  return ids.reduce(
    (entries, id) =>
      entries.concat('\n').concat(`https://idea-sprout.web.app/ideas/${id}`),
    '',
  );
});
