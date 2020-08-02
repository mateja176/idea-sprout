import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();

export const adjustIdeaCount = functions.firestore
  .document('ideas/{ideaId}')
  .onUpdate(async (handler) => {
    const data = handler.after.data();
    const ideasCountRef = admin.firestore().doc('counts/ideas');
    if (data && 'status' in data) {
      if (data.status === 'sprout') {
        return ideasCountRef.update({
          count: admin.firestore.FieldValue.increment(1),
        });
      } else if (data.status === 'seed') {
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
