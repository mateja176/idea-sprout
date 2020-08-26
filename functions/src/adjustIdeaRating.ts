import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

interface Review {
  rating: number;
  feedback: string;
}

interface WithRating {
  averageRating: number;
  ratingCount: number;
}

export const adjustIdeaRating = functions.firestore
  .document('ideas/{ideaId}/reviews/{uid}')
  .onWrite(async (change, context) => {
    const dataBefore = change.before.data() as Review | undefined;
    const dataAfter: Review = change.after.data() as Review;

    const ideaId: string = context.params.ideaId;

    const ideaRef = admin.firestore().collection('ideas').doc(ideaId);

    const idea = (await ideaRef.get()).data() as WithRating;

    if (dataBefore) {
      const newAverage =
        (idea.averageRating * idea.ratingCount -
          dataBefore.rating +
          dataAfter.rating) /
        idea.ratingCount;
      await ideaRef.update({
        averageRating: admin.firestore.FieldValue.increment(
          newAverage - idea.averageRating,
        ),
      });
    } else {
      const newAverage =
        (idea.averageRating * idea.ratingCount + dataAfter.rating) /
        (idea.ratingCount + 1);
      await ideaRef.update({
        ratingCount: admin.firestore.FieldValue.increment(1),
        averageRating: admin.firestore.FieldValue.increment(
          newAverage - idea.averageRating,
        ),
      });
    }
  });
