import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

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
        return ideasAggregateRef.update({
          [change.after.id]: true,
        });
      } else if (
        dataBefore.status === 'sprout' &&
        dataAfter.status === 'seed'
      ) {
        return ideasAggregateRef.update({
          [change.after.id]: admin.firestore.FieldValue.delete(),
        });
      } else {
        return null;
      }
    } else {
      return null;
    }
  });
