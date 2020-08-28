import { useBoolean } from 'ahooks';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import qs from 'qs';
import React, { useContext, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import {
  ReactFireOptions,
  useFirestoreCollection as useFirebaseFirestoreCollection,
  useFirestoreDoc as useFirebaseFirestoreDoc,
  useFunctions as useFirebaseFunctions,
  useStorageDownloadURL as useFirebaseStorageDownloadUrl,
  useUser as useFirebaseUser,
} from 'reactfire';
import { ShareOptionProvider } from '../components/share/share';
import { SnackbarContext } from '../context/snackbar';
import { absolutePrivateRoute } from '../elements/routes';
import { User } from '../models/auth';
import { CreationIdea, IdeaModel } from '../models/idea';
import { WithId } from '../models/models';
import { Review } from '../models/review';
import { Order, Upgrade } from '../models/upgrade';
import { createUpdateIdea } from '../services/store/slices/ideas';
import {
  convertFirestoreCollection,
  convertFirestoreDocument,
  firestoreCollections,
  hasOnlyId,
} from '../utils/firebase';
import { getInitialIdea } from '../utils/idea/idea';
import { useAnalytics } from './analytics';
import { useActions } from './hooks';

export const useUser = <U = User>(options?: ReactFireOptions<U | null>) =>
  useFirebaseUser<U | null>(undefined, options);

// * in spite of what is written in the docs
// * about the hooks not throwing when a start value is supplied
// * the hook still causes the component to suspend
export const useMaybeUser = () => {
  const user = useFirebaseUser(firebase.auth(), {
    startWithValue: 'loading' as const,
  });

  return user === 'loading' ? null : user; // * null cannot be provided as a value to start with
};

export const useSignedInUser = (options?: ReactFireOptions<firebase.User>) =>
  useFirebaseUser<firebase.User>(undefined, options);

export const useFirestore = () => firebase.firestore();

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

export const useIdeasAggregateRef = () => {
  const ideasRef = useIdeasRef();

  return React.useMemo(() => ideasRef.doc('aggregate'), [ideasRef]);
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

  const { log } = useAnalytics();

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

        log({ name: 'reviewIdea', params: { uid: user.uid } });
      });
    // * the promise is not rejected even if the client is offline
    // * the promise is pending until it resolves or the tab is closed
  };
};

const shareIdeaActionCreators = { updateIdea: createUpdateIdea };

export const useShareIdea = (idea: IdeaModel) => {
  const { updateIdea } = useActions(shareIdeaActionCreators);

  const user = useMaybeUser();

  const ideaRef = useIdeaRef(idea.id);

  const { log } = useAnalytics();

  if (!user || Object.keys(idea.sharedBy).includes(user.uid)) {
    return (provider: ShareOptionProvider) => {};
  } else {
    return (provider: ShareOptionProvider) => {
      return ideaRef
        .update({
          [`sharedBy.${user.uid}`]: true,
        })
        .then(() => {
          updateIdea({
            id: idea.id,
            sharedBy: { ...idea.sharedBy, [user.uid]: true },
          });

          log({ name: 'shareIdea', params: { uid: user.uid, provider } });
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
  const user = useUser();

  const { queueSnackbar } = useContext(SnackbarContext);

  const history = useHistory();

  const ideasRef = useIdeasRef();

  const [loading, setLoading] = useBoolean();

  const { log } = useAnalytics();

  return React.useMemo(
    () => ({
      create: user
        ? () => {
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
              .then((doc) => {
                queueSnackbar({
                  severity: 'success',
                  message: 'Update, publish and share to get feedback!',
                  autoHideDuration: 10000,
                });

                log({
                  name: 'createIdea',
                  params: { id: doc.id, uid: user.uid },
                });
              });
          }
        : () => Promise.resolve(),
      loading,
    }),
    [loading, ideasRef, user, queueSnackbar, history, setLoading, log],
  );
};

export const useFunctions = () => useFirebaseFunctions();
export const useUpgradeToPro = () => {
  const functions = useFunctions();
  return useMemo<Upgrade>(() => functions.httpsCallable('upgradeToPro'), [
    functions,
  ]);
};
