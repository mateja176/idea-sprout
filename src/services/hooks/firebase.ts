import useBoolean from 'ahooks/es/useBoolean';
import { SnackbarContext } from 'context/snackbar';
import firebase from 'firebase/app';
import { CreationIdea, IdeaModel, Order, Review, User, WithId } from 'models';
import qs from 'qs';
import { useContext, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import {
  ReactFireOptions,
  useFirestore,
  useFirestoreCollection as useFirebaseFirestoreCollection,
  useFirestoreDoc as useFirebaseFirestoreDoc,
  useFunctions as useFirebaseFunctions,
  useStorageDownloadURL as useFirebaseStorageDownloadUrl,
  useUser as useFirebaseUser,
} from 'reactfire';
import { createUpdateIdea } from 'services/store';
import {
  convertFirestoreCollection,
  convertFirestoreDocument,
  firestoreCollections,
  hasOnlyId,
} from 'utils/firebase';
import { getInitialIdea } from 'utils/idea';
import { absolutePrivateRoute } from 'utils/routes';
import { useActions } from './hooks';

export const useUser = <U = User>(options?: ReactFireOptions<U | null>) =>
  useFirebaseUser<U | null>(undefined, options);

export const useUserState = () =>
  useFirebaseUser<'loading' | User | null>(undefined, {
    startWithValue: 'loading',
  });

export const useSignedInUser = (options?: ReactFireOptions<firebase.User>) =>
  useFirebaseUser<firebase.User>(undefined, options);

export const useUsersRef = () => {
  const firestore = useFirestore();

  return useMemo(() => firestore.collection(firestoreCollections.users.path), [
    firestore,
  ]);
};

export const useUserRef = (uid: User['uid']) => {
  const usersRef = useUsersRef();
  return useMemo(() => usersRef.doc(uid), [usersRef, uid]);
};

export const useCountsRef = () => {
  const firestore = useFirestore();

  return useMemo(() => firestore.collection(firestoreCollections.counts.path), [
    firestore,
  ]);
};

export const useIdeasCountRef = () => {
  const countsRef = useCountsRef();
  return useMemo(() => countsRef.doc(firestoreCollections.ideas.path), [
    countsRef,
  ]);
};

export const useIdeasRef = () => {
  const firestore = useFirestore();

  return useMemo(() => firestore.collection(firestoreCollections.ideas.path), [
    firestore,
  ]);
};

export const useIdeaRef = (id: IdeaModel['id']) => {
  const ideasRef = useIdeasRef();
  return useMemo(() => ideasRef.doc(id), [ideasRef, id]);
};

export const useReviewsRef = (id: IdeaModel['id']) => {
  const ideaRef = useIdeaRef(id);

  return useMemo(
    () =>
      ideaRef.collection(firestoreCollections.ideas.collections.reviews.path),
    [ideaRef],
  );
};

export const useReviewRef = (id: IdeaModel['id'], uid: User['uid']) => {
  const reviewsRef = useReviewsRef(id);

  return useMemo(() => reviewsRef.doc(uid), [uid, reviewsRef]);
};

export const useOrdersRef = () => {
  const firestore = useFirestore();

  return useMemo(() => firestore.collection(firestoreCollections.orders.path), [
    firestore,
  ]);
};

export const useOrderRef = (id: Order['id']) => {
  const ordersRef = useOrdersRef();

  return useMemo(() => ordersRef.doc(id), [id, ordersRef]);
};

export const useFirestoreDoc = <T extends WithId>(
  ref: firebase.firestore.DocumentReference,
  options?: ReactFireOptions<T>,
): T | null => {
  const doc = useFirebaseFirestoreDoc(ref, options);

  return useMemo(() => {
    const convertedDoc = convertFirestoreDocument<T>(doc);

    return hasOnlyId(convertedDoc) ? null : convertedDoc;
  }, [doc]);
};

export const useFirestoreCollection = <T extends WithId>(
  query: firebase.firestore.Query,
  options?: ReactFireOptions<T[]>,
) => {
  const snapshot = useFirebaseFirestoreCollection<T>(query, options);

  return convertFirestoreCollection<T>(snapshot);
};

const reviewSubmitActionCreators = {
  updateIdea: createUpdateIdea,
};

type RatingUpdate = Record<
  Extract<keyof IdeaModel, 'averageRating' | 'ratingCount'>,
  firebase.firestore.FieldValue
>;

export const useReviewSubmit = ({
  idea,
  currentReview,
}: {
  idea: IdeaModel;
  currentReview: Review | null;
}) => {
  const { updateIdea } = useActions(reviewSubmitActionCreators);

  const { queueSnackbar } = useContext(SnackbarContext);

  const user = useSignedInUser();

  const reviewsRef = useReviewsRef(idea.id);

  return ({ rating, feedback }: Pick<Review, 'rating' | 'feedback'>) => {
    const countIncrement = Number(!currentReview);
    const count = idea.ratingCount + countIncrement;

    const average = currentReview
      ? (idea.ratingCount * idea.averageRating -
          currentReview.rating +
          rating) /
        idea.ratingCount
      : (idea.averageRating * idea.ratingCount + rating) / count;

    return reviewsRef
      .doc(user.uid)
      .set({
        rating,
        feedback,
      })
      .then(() => {
        updateIdea({
          id: idea.id,
          averageRating: average,
          ratingCount: count,
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

const shareIdeaActionCreators = { updateIdea: createUpdateIdea };

export const useShareIdea = (idea: IdeaModel) => {
  const { updateIdea } = useActions(shareIdeaActionCreators);

  const user = useSignedInUser();

  const ideaRef = useIdeaRef(idea.id);

  if (Object.keys(idea.sharedBy).includes(user.uid)) {
    return () => {};
  } else {
    return () => {
      return ideaRef
        .update({
          [`sharedBy.${user.uid}`]: true,
        })
        .then(() => {
          updateIdea({
            id: idea.id,
            sharedBy: { ...idea.sharedBy, [user.uid]: true },
          });
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

export const useCreateIdea = () => {
  const user = useSignedInUser();

  const { queueSnackbar } = useContext(SnackbarContext);

  const history = useHistory();

  const ideasRef = useIdeasRef();

  const [loading, setLoading] = useBoolean();

  const create = () => {
    setLoading.setTrue();
    history.push({
      pathname: absolutePrivateRoute.ideas.path,
      search: qs.stringify({ author: user.uid }),
    });
    const newIdea: CreationIdea = {
      ...getInitialIdea(user.uid),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };
    // * the promise is not rejected even if the client is offline
    // * the promise is pending until it resolves or the tab is closed
    return ideasRef
      .add(newIdea)
      .finally(setLoading.setFalse)
      .then(() => {
        queueSnackbar({
          severity: 'success',
          message: 'Update, publish and share to get feedback!',
          autoHideDuration: 10000,
        });
      });
  };

  return {
    create,
    loading,
  };
};

export const useFunctions = () => useFirebaseFunctions();
export const useUpgradeToPro = () => {
  const functions = useFunctions();
  return useMemo<
    (params: {
      orderId: string;
    }) => Promise<firebase.functions.HttpsCallableResult>
  >(() => functions.httpsCallable('upgradeToPro'), [functions]);
};
