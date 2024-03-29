import {
  assertFails,
  assertSucceeds,
  clearFirestoreData,
  firestore,
  initializeAdminApp,
  initializeTestApp,
} from '@firebase/testing';
import { CreationIdea } from '../models/idea';
import { RawReview } from '../models/review';
import { firestoreCollections } from '../utils/firebase';
import { getInitialIdea } from '../utils/idea/idea';

const projectId = 'idea-sprout';
const myId = '1';
const theirId = '2';
const myAuth = { uid: myId };
const getFirestore = (auth?: typeof myAuth) =>
  initializeTestApp({
    auth,
    projectId,
  }).firestore();
const getAdminFirestore = () =>
  initializeAdminApp({
    projectId,
  }).firestore();

const mySeed: CreationIdea = {
  ...getInitialIdea(myAuth.uid),
  createdAt: firestore.FieldValue.serverTimestamp(),
};
const mySprout: CreationIdea = { ...mySeed, status: 'sprout' };
const theirSprout: CreationIdea = { ...mySprout, author: theirId };
const theirSeed: CreationIdea = { ...mySeed, author: theirId };

const seedDb = () => {
  const db = getAdminFirestore();

  const ideasRef = db.collection(firestoreCollections.ideas.path);

  return Promise.all([
    ideasRef.add(mySeed),
    ideasRef.add(mySprout),
    ideasRef.add(theirSprout),
    ideasRef.add(theirSeed),
  ]);
};

const getMySprout = () =>
  getAdminFirestore().collection(firestoreCollections.ideas.path).add(mySprout);

describe('Firestore rules', () => {
  afterEach(() => clearFirestoreData({ projectId }));

  test('users can read all of his or her ideas and idea sprouts, but not seeds', async () => {
    const [sprout, seed, theirSprout, theirSeed] = await seedDb();

    const db = getFirestore(myAuth);

    await assertSucceeds(
      db
        .collection(firestoreCollections.ideas.path)
        .where('author', '==', myId)
        .limit(30)
        .get(),
    );
    await assertSucceeds(
      db
        .collection(firestoreCollections.ideas.path)
        .where('status', '==', 'sprout')
        .limit(30)
        .get(),
    );
    await assertSucceeds(
      db.collection(firestoreCollections.ideas.path).doc(sprout.id).get(),
    );
    await assertSucceeds(
      db.collection(firestoreCollections.ideas.path).doc(seed.id).get(),
    );
    await assertSucceeds(
      db.collection(firestoreCollections.ideas.path).doc(theirSprout.id).get(),
    );
    await assertFails(
      db.collection(firestoreCollections.ideas.path).doc(theirSeed.id).get(),
    );
  });

  test('user can update solely his or her ideas and not update rating fields', async () => {
    const [, seed, , theirSeed] = await seedDb();

    const db = getFirestore(myAuth);

    await assertSucceeds(
      db
        .collection(firestoreCollections.ideas.path)
        .doc(seed.id)
        .update({
          story: {
            path: 'videos/placeholder-story.mp4',
            width: 1920,
            height: 1080,
          },
        }),
    );
    await assertSucceeds(
      db
        .collection(firestoreCollections.ideas.path)
        .doc(seed.id)
        .update({
          images: [
            { path: 'images/placeholder-image.png', width: 1920, height: 1080 },
          ],
        }),
    );
    await assertFails(
      db
        .collection(firestoreCollections.ideas.path)
        .doc(theirSeed.id)
        .update({ averageRating: 1 }),
    );
    await assertFails(
      db
        .collection(firestoreCollections.ideas.path)
        .doc(seed.id)
        .update({ averageRating: 5 }),
    );
    await assertFails(
      db
        .collection(firestoreCollections.ideas.path)
        .doc(seed.id)
        .update({ ratingCount: 1 }),
    );
  });

  test('user cannot create idea with non-zero rating fields', async () => {
    const db = getFirestore(myAuth);

    await assertSucceeds(
      db.collection(firestoreCollections.ideas.path).add(mySeed),
    );
    await assertFails(
      db
        .collection(firestoreCollections.ideas.path)
        .add({ ...mySeed, averageRating: 5 }),
    );
    await assertFails(
      db
        .collection(firestoreCollections.ideas.path)
        .add({ ...mySeed, ratingCount: 1 }),
    );
  });

  test('user can review ideas or update their review', async () => {
    const db = getFirestore(myAuth);

    const { id } = await getAdminFirestore()
      .collection(firestoreCollections.ideas.path)
      .add(theirSprout);

    await assertFails(
      db
        .batch()
        .set(
          db
            .collection(firestoreCollections.ideas.path)
            .doc(id)
            .collection(firestoreCollections.ideas.collections.reviews.path)
            .doc(myId),
          {
            rating: 6,
            feedback:
              'Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem neque dolores mollitia temporibus ipsum consequuntur.',
          } as RawReview,
        )
        .update(db.collection(firestoreCollections.ideas.path).doc(id), {
          averageRating: 6,
          ratingCount: 1,
        })
        .commit(),
    );
    await assertFails(
      db
        .batch()
        .set(
          db
            .collection(firestoreCollections.ideas.path)
            .doc(id)
            .collection(firestoreCollections.ideas.collections.reviews.path)
            .doc(myId),
          {
            rating: -1,
            feedback:
              'Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem neque dolores mollitia temporibus ipsum consequuntur.',
          } as RawReview,
        )
        .update(db.collection(firestoreCollections.ideas.path).doc(id), {
          averageRating: -1,
          ratingCount: 1,
        })
        .commit(),
    );
    await assertFails(
      db
        .batch()
        .set(
          db
            .collection(firestoreCollections.ideas.path)
            .doc(id)
            .collection(firestoreCollections.ideas.collections.reviews.path)
            .doc(myId),
          {
            rating: 4.5,
            feedback:
              'Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem neque dolores mollitia temporibus ipsum consequuntur.',
          } as RawReview,
        )
        .update(db.collection(firestoreCollections.ideas.path).doc(id), {
          averageRating: -1,
          ratingCount: 1,
        })
        .commit(),
    );
    // * create
    await assertSucceeds(
      db
        .batch()
        .set(
          db
            .collection(firestoreCollections.ideas.path)
            .doc(id)
            .collection(firestoreCollections.ideas.collections.reviews.path)
            .doc(myId),
          {
            rating: 5,
            feedback:
              'Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem neque dolores mollitia temporibus ipsum consequuntur.',
          } as RawReview,
        )
        .update(db.collection(firestoreCollections.ideas.path).doc(id), {
          averageRating: 5,
          ratingCount: 1,
        })
        .commit(),
    );
    // * update
    await assertSucceeds(
      db
        .batch()
        .set(
          db
            .collection(firestoreCollections.ideas.path)
            .doc(id)
            .collection(firestoreCollections.ideas.collections.reviews.path)
            .doc(myId),
          {
            rating: 4,
            feedback:
              'Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem neque dolores mollitia temporibus ipsum consequuntur.',
          } as RawReview,
        )
        .update(db.collection(firestoreCollections.ideas.path).doc(id), {
          averageRating: 4,
          ratingCount: 1,
        })
        .commit(),
    );
    // * user cannot increase the review count when updating
    await assertFails(
      db
        .batch()
        .set(
          db
            .collection(firestoreCollections.ideas.path)
            .doc(id)
            .collection(firestoreCollections.ideas.collections.reviews.path)
            .doc(myId),
          {
            rating: 4,
            feedback:
              'Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem neque dolores mollitia temporibus ipsum consequuntur.',
          } as RawReview,
        )
        .update(db.collection(firestoreCollections.ideas.path).doc(id), {
          averageRating: 4,
          ratingCount: 2,
        })
        .commit(),
    );
  });

  test('user cannot review his or her ideas', async () => {
    const db = getFirestore(myAuth);

    const { id } = await getMySprout();

    await assertFails(
      db
        .batch()
        .set(
          db
            .collection(firestoreCollections.ideas.path)
            .doc(id)
            .collection(firestoreCollections.ideas.collections.reviews.path)
            .doc(myId),
          {
            rating: 5,
            feedback:
              'Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem neque dolores mollitia temporibus ipsum consequuntur.',
          } as RawReview,
        )
        .update(db.collection(firestoreCollections.ideas.path).doc(id), {
          averageRating: 5,
          ratingCount: 1,
        })
        .commit(),
    );
  });

  test('user should not be allowed to delete ideas', async () => {
    const db = getFirestore(myAuth);

    const { id } = await getMySprout();

    await assertFails(
      db.collection(firestoreCollections.ideas.path).doc(id).delete(),
    );
  });

  test('users can read ideas count', async () => {
    const db = getFirestore(myAuth);

    await getAdminFirestore()
      .collection(firestoreCollections.ideas.path)
      .doc('aggregate')
      .set({ count: 0 });

    await assertSucceeds(
      db.collection(firestoreCollections.ideas.path).doc('aggregate').get(),
    );
  });

  test("user can increase any idea's share count by 1 only once", async () => {
    const [mySprout, , theirSprout] = await seedDb();

    const db = getFirestore(myAuth);

    await assertSucceeds(
      db
        .collection(firestoreCollections.ideas.path)
        .doc(mySprout.id)
        .update({ [`sharedBy.${myId}`]: true }),
    );
    await assertFails(
      db
        .collection(firestoreCollections.ideas.path)
        .doc(mySprout.id)
        .update({ [`sharedBy.${theirId}`]: true }),
    );
    await assertSucceeds(
      db
        .collection(firestoreCollections.ideas.path)
        .doc(theirSprout.id)
        .update({ [`sharedBy.${myId}`]: true }),
    );
  });
});
