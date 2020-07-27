import { useBoolean } from 'ahooks';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { IdeaModel, RawIdea, Review, User, WithCount, WithId } from 'models';
import qs from 'qs';
import { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import {
  ReactFireOptions,
  useAuth as useFirebaseAuth,
  useFirestoreCollection as useFirebaseFirestoreCollection,
  useFirestoreDoc as useFirebaseFirestoreDoc,
  useStorageDownloadURL as useFirebaseStorageDownloadUrl,
  useUser as useFirebaseUser,
} from 'reactfire';
import { createQueueSnackbar } from 'services';
import { createUpdateIdea } from 'services/store';
import {
  absolutePrivateRoute,
  convertFirestoreCollection,
  convertFirestoreDocument,
  firestoreCollections,
  getInitialIdea,
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

export const useUsersRef = () =>
  useMemo(
    () => firebase.firestore().collection(firestoreCollections.users.path),
    [],
  );

export const useUserRef = (uid: User['uid']) => {
  const usersRef = useUsersRef();
  return useMemo(() => usersRef.doc(uid), [usersRef, uid]);
};

export const useCountsRef = () => {
  return useMemo(
    () => firebase.firestore().collection(firestoreCollections.counts.path),
    [],
  );
};

export const useIdeasCountRef = () => {
  const countsRef = useCountsRef();
  return useMemo(() => countsRef.doc(firestoreCollections.ideas.path), [
    countsRef,
  ]);
};

export const useIdeasRef = () => {
  return useMemo(
    () => firebase.firestore().collection(firestoreCollections.ideas.path),
    [],
  );
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

export const useFirestoreDoc = <T extends WithId>(
  ref: firebase.firestore.DocumentReference,
  options?: ReactFireOptions<T>,
): T | null => {
  const doc = (useFirebaseFirestoreDoc(ref, options) as unknown) as
    | firebase.firestore.DocumentSnapshot<Omit<T, 'id'>>
    | T;

  return useMemo(() => {
    const convertedDoc = convertFirestoreDocument<T>(doc);

    return hasOnlyId(convertedDoc) ? null : convertedDoc;
  }, [doc]);
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
  currentReview: Review | null;
}) => {
  const { queueSnackbar, updateIdea } = useActions({
    queueSnackbar: createQueueSnackbar,
    updateIdea: createUpdateIdea,
  });

  const user = useSignedInUser();

  const reviewsRef = useReviewsRef(idea.id);

  const ideaRef = useIdeaRef(idea.id);

  return ({ rating, feedback }: Pick<Review, 'rating' | 'feedback'>) => {
    const count = currentReview ? idea.ratingCount : idea.ratingCount + 1;

    const average = currentReview
      ? (idea.ratingCount * idea.averageRating -
          currentReview.rating +
          rating) /
        idea.ratingCount
      : (idea.averageRating * idea.ratingCount + rating) / count;

    const averageIncrement = average - idea.averageRating;

    return firebase
      .firestore()
      .batch()
      .set(reviewsRef.doc(user.uid), {
        rating,
        feedback,
      })
      .update(ideaRef, {
        averageRating: firebase.firestore.FieldValue.increment(
          averageIncrement,
        ),
        ratingCount: firebase.firestore.FieldValue.increment(1),
      } as { [key in Extract<keyof IdeaModel, 'averageRating' | 'ratingCount'>]: firebase.firestore.FieldValue })
      .commit()
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

export const useShareIdea = (idea: IdeaModel) => {
  const { updateIdea } = useActions({ updateIdea: createUpdateIdea });

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

export const useUpdateWithCount = (id: IdeaModel['id']) => {
  const ideasRef = useIdeasRef();

  const ideasCountRef = useIdeasCountRef();

  return useCallback(
    ({ count, ...partialIdea }: WithCount & Partial<RawIdea>) => {
      const ideaRef = ideasRef.doc(id);
      return firebase
        .firestore()
        .batch()
        .update(ideaRef, partialIdea)
        .update(ideasCountRef, {
          count: firebase.firestore.FieldValue.increment(count),
        })
        .commit();
    },
    [id, ideasRef, ideasCountRef],
  );
};

export const useCreateIdea = () => {
  const user = useSignedInUser();

  const { queueSnackbar } = useActions({ queueSnackbar: createQueueSnackbar });

  const history = useHistory();

  const ideasRef = useIdeasRef();

  const [loading, setLoading] = useBoolean();

  const create = () => {
    setLoading.setTrue();
    history.push({
      pathname: absolutePrivateRoute.ideas.path,
      search: qs.stringify({ author: user.uid }),
    });
    // * the promise is not rejected even if the client is offline
    // * the promise is pending until it resolves or the tab is closed
    return ideasRef
      .add(getInitialIdea(user.uid))
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
