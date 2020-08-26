import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import fetch from 'node-fetch';

const pingGoogleCrawler =
  'http://www.google.com/ping?sitemap=https://idea-sprout.web.app/sitemap.txt';

export const adjustIdeasAggregate = functions.firestore
  .document('ideas/{ideaId}')
  .onUpdate(async (change) => {
    const dataBefore = change.before.data();
    const dataAfter = change.after.data();
    const ideasAggregateRef = admin
      .firestore()
      .collection('ideas')
      .doc('aggregate');
    if (
      dataBefore &&
      'status' in dataBefore &&
      dataAfter &&
      'status' in dataAfter
    ) {
      if (dataBefore.status === 'seed' && dataAfter.status === 'sprout') {
        await ideasAggregateRef.update({
          [change.after.id]: true,
        });
        return fetch(pingGoogleCrawler);
      } else if (
        dataBefore.status === 'sprout' &&
        dataAfter.status === 'seed'
      ) {
        await ideasAggregateRef.update({
          [change.after.id]: admin.firestore.FieldValue.delete(),
        });
        return fetch(pingGoogleCrawler);
      } else {
        return null;
      }
    } else {
      return null;
    }
  });
