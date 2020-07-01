import firebase from 'firebase/app';
import 'firebase/firestore';
import { IdeaModel, Review, User, WithId } from 'models';
import {
  ReactFireOptions,
  useFirestoreCollection as useFirebaseFirestoreCollection,
  useFirestoreDoc as useFirebaseFirestoreDoc,
  useUser as useFirebaseUser,
} from 'reactfire';
import { createQueueSnackbar } from 'services';
import {
  convertFirestoreCollection,
  convertFirestoreDocument,
  firestoreCollections,
  hasOnlyId,
} from 'utils';
import { useActions } from './hooks';

export const useSignedInUser = (options?: ReactFireOptions<User>) =>
  useFirebaseUser<User>(firebase.auth(), options);

export const getIdeasRef = () =>
  firebase.firestore().collection(firestoreCollections.ideas.path);
export const useIdeasRef = () => {
  return getIdeasRef();
};

export const useReviewsRef = (id: IdeaModel['id']) => {
  const ideasRef = useIdeasRef();

  return ideasRef
    .doc(id)
    .collection(firestoreCollections.ideas.collections.reviews.path);
};

export const useFirestoreDoc = <T extends WithId>(
  ref: firebase.firestore.DocumentReference,
  options?: ReactFireOptions<T>,
): T | null => {
  const doc = (useFirebaseFirestoreDoc(ref, options) as unknown) as
    | firebase.firestore.DocumentSnapshot<Omit<T, 'id'>>
    | T;

  const convertedDoc = convertFirestoreDocument<T>(doc);

  return hasOnlyId(convertedDoc) ? null : convertedDoc;
};

export const useFirestoreCollection = <T extends WithId>(
  query: firebase.firestore.Query,
  options?: ReactFireOptions<T[]>,
) => {
  const snapshot = (useFirebaseFirestoreCollection<Omit<T, 'id'>>(
    query,
    options,
  ) as unknown) as firebase.firestore.QuerySnapshot<Omit<T, 'id'>> | T[];

  return convertFirestoreCollection<T>(snapshot);
};

export const useReviewSubmit = (id: IdeaModel['id']) => {
  const { queueSnackbar } = useActions({ queueSnackbar: createQueueSnackbar });

  const user = useSignedInUser();

  const reviewsRef = useReviewsRef(id);

  return ({ rating, feedback }: Pick<Review, 'rating' | 'feedback'>) => {
    return reviewsRef
      .doc(user.uid)
      .set({ rating, feedback, author: user.email })
      .then(() => {
        queueSnackbar({
          severity: 'success',
          message: 'Review submitted',
        });
      })
      .catch(() => {
        queueSnackbar({
          severity: 'error',
          message: 'Failed to submit, please retry',
        });
      });
  };
};

export const useShareIdea = (idea: IdeaModel) => {
  const user = useSignedInUser();

  const ideaRef = useIdeasRef().doc(idea.id);

  const withSharedBy: Pick<IdeaModel, 'sharedBy'> = {
    sharedBy: idea.sharedBy.concat(user.uid),
  };

  return () => {
    return ideaRef.update(withSharedBy);
  };
};
