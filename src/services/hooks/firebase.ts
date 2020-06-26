import { firestore } from 'firebase/app';
import { IdeaModel, WithId } from 'models';
import {
  ReactFireOptions,
  useFirestore,
  useFirestoreCollection as useFirebaseFirestoreCollection,
} from 'reactfire';

export const useIdeasRef = () => {
  return useFirestore().collection('ideas');
};

export const useReviewsRef = (id: IdeaModel['id']) => {
  const ideasRef = useIdeasRef();

  return ideasRef.doc(id).collection('reviews');
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
