import {
  assertFails,
  assertSucceeds,
  clearFirestoreData,
  firestore,
  initializeAdminApp,
  initializeTestApp,
} from '@firebase/testing';
import { RawIdea, RawReview } from 'models';
import { firestoreCollections, getInitialIdea } from 'utils';

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

const mySeed: RawIdea = {
  ...getInitialIdea(myAuth.uid),
  createdAt: firestore.Timestamp.now(),
};
const mySprout: RawIdea = { ...mySeed, status: 'sprout' };
const theirSprout: RawIdea = { ...mySprout, author: theirId };
const theirSeed: RawIdea = { ...mySeed, author: theirId };

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

describe('Firestore rules', () => {
  afterEach(() => clearFirestoreData({ projectId }));

  test('users can read all of his or her ideas and idea sprouts, but not seeds', async () => {
    const [sprout, seed, theirSprout, theirSeed] = await seedDb();

    const db = getFirestore(myAuth);

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
    const [sprout, seed, theirSprout, theirSeed] = await seedDb();

    const db = getFirestore(myAuth);

    await assertSucceeds(
      db
        .collection(firestoreCollections.ideas.path)
        .doc(seed.id)
        .update({ status: 'sprout' }),
    );
    await assertFails(
      db
        .collection(firestoreCollections.ideas.path)
        .doc(theirSeed.id)
        .update({ status: 'sprout' }),
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

  test('user can review ideas but cannot review his or her ideas', async () => {
    const db = getFirestore(myAuth);

    const { id } = await getAdminFirestore()
      .collection(firestoreCollections.ideas.path)
      .add(theirSprout);

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
  });
});
