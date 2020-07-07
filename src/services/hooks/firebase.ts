import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { IdeaModel, RawIdea, Review, User, WithCount, WithId } from 'models';
import {
  ReactFireOptions,
  useAuth as useFirebaseAuth,
  useFirestoreCollection as useFirebaseFirestoreCollection,
  useFirestoreDoc as useFirebaseFirestoreDoc,
  useStorageDownloadURL as useFirebaseStorageDownloadUrl,
  useUser as useFirebaseUser,
} from 'reactfire';
import { createQueueSnackbar } from 'services';
import { createSetIdea } from 'services/store';
import {
  convertFirestoreCollection,
  convertFirestoreDocument,
  firestoreCollections,
  hasOnlyId,
} from 'utils';
import { useActions } from './hooks';

export const useAuth = () => {
  return useFirebaseAuth();
};

export const useUser = (options?: ReactFireOptions<User | null>) =>
  useFirebaseUser<User | null>(firebase.auth(), options);

export const useSignedInUser = (options?: ReactFireOptions<User>) =>
  useFirebaseUser<User>(firebase.auth(), options);

export const useCountsRef = () => {
  return firebase.firestore().collection(firestoreCollections.counts.path);
};

export const useIdeasCountRef = () => {
  return useCountsRef().doc(firestoreCollections.ideas.path);
};

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

export const useStorage = () => {
  return firebase.storage();
};

export const useReviewSubmit = ({
  idea,
  currentReview,
}: {
  idea: IdeaModel;
  currentReview?: Review;
}) => {
  const { queueSnackbar, setIdea } = useActions({
    queueSnackbar: createQueueSnackbar,
    setIdea: createSetIdea,
  });

  const user = useSignedInUser();

  const reviewsRef = useReviewsRef(idea.id);

  const ideaRef = useIdeasRef().doc(idea.id);

  return ({ rating, feedback }: Pick<Review, 'rating' | 'feedback'>) => {
    const count = currentReview ? idea.rating.count : idea.rating.count + 1;

    const average = currentReview
      ? (idea.rating.count * idea.rating.average -
          currentReview.rating +
          rating) /
        idea.rating.count
      : (idea.rating.average * idea.rating.count + rating) / count;

    return firebase
      .firestore()
      .batch()
      .set(reviewsRef.doc(user.uid), {
        rating,
        feedback,
        author: user.email,
      })
      .update(ideaRef, {
        rating: {
          average: firebase.firestore.FieldValue.increment(
            average - idea.rating.average,
          ),
          count: currentReview
            ? count
            : firebase.firestore.FieldValue.increment(1),
        },
      })
      .commit()
      .then(() => {
        setIdea({
          id: idea.id,
          rating: {
            count,
            average,
          },
        });

        queueSnackbar({
          severity: 'success',
          message: 'Review submitted',
        });
      });
    // * the promise is not rejected even if the client is offline
    // * the promise is pending until it resolves or the tab is closed
  };
};

export const useShareIdea = (idea: IdeaModel) => {
  const { setIdea } = useActions({ setIdea: createSetIdea });

  const user = useSignedInUser();

  const ideaRef = useIdeasRef().doc(idea.id);

  if (idea.sharedBy.includes(user.email || '')) {
    return () => {};
  } else {
    const withSharedBy: Pick<IdeaModel, 'sharedBy'> = {
      sharedBy: idea.sharedBy.concat(user.uid),
    };

    return () => {
      return ideaRef.update(withSharedBy).then(() => {
        setIdea({ id: idea.id, ...withSharedBy });
      });
    };
  }
};

export const useStorageDownloadUrl: typeof useFirebaseStorageDownloadUrl = (
  path,
  options,
) => {
  return useFirebaseStorageDownloadUrl(path, options);
};

export const useUpdateWithCount = (id: IdeaModel['id']) => {
  const ideaRef = useIdeasRef().doc(id);

  const ideasCountRef = useIdeasCountRef();

  const batch = firebase.firestore().batch();

  return ({ count, ...partialIdea }: WithCount & Partial<RawIdea>) =>
    batch
      .update(ideaRef, partialIdea)
      .update(ideasCountRef, {
        count: firebase.firestore.FieldValue.increment(count),
      })
      .commit();
};
