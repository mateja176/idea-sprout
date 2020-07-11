import {
  assertFails,
  assertSucceeds,
  clearFirestoreData,
  firestore,
  initializeAdminApp,
  initializeTestApp,
} from '@firebase/testing';
import { RawIdea } from 'models';
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
const seedDb = () => {
  const db = getAdminFirestore();

  const ideasRef = db.collection(firestoreCollections.ideas.path);

  const seed: RawIdea = {
    ...getInitialIdea(myAuth.uid),
    createdAt: firestore.Timestamp.now(),
  };
  const sprout: RawIdea = { ...seed, status: 'sprout' };

  const theirSprout: RawIdea = { ...sprout, author: theirId };
  const theirSeed: RawIdea = { ...seed, author: theirId };

  return Promise.all([
    ideasRef.add(seed),
    ideasRef.add(sprout),
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

  test('user can write solely to his or her ideas and not update rating', async () => {
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
        .doc(seed.id)
        .update({ averageRating: 5 }),
    );
    await assertFails(
      db
        .collection(firestoreCollections.ideas.path)
        .doc(seed.id)
        .update({ ratingCount: 2 }),
    );
    await assertFails(
      db
        .collection(firestoreCollections.ideas.path)
        .doc(theirSeed.id)
        .update({ status: 'sprout' }),
    );
  });
});
