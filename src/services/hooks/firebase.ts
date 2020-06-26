import { firestore } from 'firebase/app';
import { IdeaModel, User, WithId } from 'models';
import {
  ReactFireOptions,
  useFirestore,
  useFirestoreCollection as useFirebaseFirestoreCollection,
  useFirestoreDoc as useFirebaseFirestoreDoc,
  useUser as useFirebaseUser,
} from 'reactfire';

export const useSignedInUser = () => useFirebaseUser<User>();

export const useIdeasRef = () => {
  return useFirestore().collection('ideas');
};

export const useReviewsRef = (id: IdeaModel['id']) => {
  const ideasRef = useIdeasRef();

  return ideasRef.doc(id).collection('reviews');
};

export const useFirestoreDoc = <T extends WithId>(
  ref: firestore.DocumentReference,
  options?: ReactFireOptions<Omit<T, 'id'>>,
) => {
  const doc = (useFirebaseFirestoreDoc<Omit<T, 'id'>>(
    ref,
    options,
  ) as unknown) as firebase.firestore.QueryDocumentSnapshot<Omit<T, 'id'>>;

  return {
    ...doc.data(),
    id: doc.id,
  } as T;
};

export const useFirestoreCollection = <T extends WithId>(
  query: firestore.Query,
  options?: ReactFireOptions<Omit<T, 'id'>[]>,
) => {
  const snapshot = (useFirebaseFirestoreCollection<Omit<T, 'id'>>(
    query,
    options,
  ) as unknown) as firebase.firestore.QuerySnapshot<Omit<T, 'id'>>;

  return snapshot.docs.map(
    (doc) =>
      ({
        ...doc.data(),
        id: doc.id,
      } as T),
  );
};
