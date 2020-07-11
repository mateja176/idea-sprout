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

  return Promise.all([ideasRef.add(sprout), ideasRef.add(seed)]);
};

describe('Firestore rules', () => {
  afterEach(() => clearFirestoreData({ projectId }));

  test('users can read idea sprouts and not seeds', async () => {
    const [sprout, seed] = await seedDb();

    const db = getFirestore(myAuth);

    await assertSucceeds(
      db.collection(firestoreCollections.ideas.path).doc(sprout.id).get(),
    );
    await assertFails(
      db.collection(firestoreCollections.ideas.path).doc(seed.id).get(),
    );
  });
});
