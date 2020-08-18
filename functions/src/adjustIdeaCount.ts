import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

export const adjustIdeaCount = functions.firestore
  .document('ideas/{ideaId}')
  .onUpdate(async (handler) => {
    const dataBefore = handler.before.data();
    const dataAfter = handler.after.data();
    const ideasCountRef = admin.firestore().doc('counts/ideas');
    if (
      dataBefore &&
      'status' in dataBefore &&
      dataAfter &&
      'status' in dataAfter
    ) {
      if (dataBefore.status === 'seed' && dataAfter.status === 'sprout') {
        return ideasCountRef.update({
          count: admin.firestore.FieldValue.increment(1),
        });
      } else if (
        dataBefore.status === 'sprout' &&
        dataAfter.status === 'seed'
      ) {
        return ideasCountRef.update({
          count: admin.firestore.FieldValue.increment(-1),
        });
      } else {
        return null;
      }
    } else {
      return null;
    }
  });
