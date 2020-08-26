import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

export const getSitemap = functions.https.onRequest(async (req, res) => {
  const aggregateDoc = await admin
    .firestore()
    .collection('ideas')
    .doc('aggregate')
    .get();

  const idMap = aggregateDoc.data();

  if (!idMap) {
    throw new Error('Could not get site at this time, please retry later.');
  }

  const ids = Object.keys(idMap);

  const sitemap = ids.reduce(
    (entries, id) =>
      entries.concat('\n').concat(`https://idea-sprout.web.app/ideas/${id}`),
    '',
  );

  res.send(sitemap);
});
