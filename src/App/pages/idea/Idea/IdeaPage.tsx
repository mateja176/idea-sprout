import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { RouteComponentProps } from 'react-router-dom';
import RedirectToIdeas from '../../../../components/Idea/RedirectToIdeas';
import { IdeaContainer } from '../../../../containers/Idea/IdeaContainer';
import { IdeaContainerSkeleton } from '../../../../containers/Idea/IdeaContainerSkeleton';
import { SnackbarContext } from '../../../../context/snackbar';
import { useUserState } from '../../../../hooks/firebase';
import { WithMaybeUser } from '../../../../models/auth';
import { GlobalWithPreloadedIdea, IdeaModel } from '../../../../models/idea';
import { isUserLoading } from '../../../../utils/auth';

export interface IdeaPageProps
  extends WithMaybeUser,
    RouteComponentProps<
      { id: IdeaModel['id'] },
      {},
      { idea: IdeaModel } | null
    > {}

const IdeaPage: React.FC<IdeaPageProps> = ({
  user,
  match: {
    params: { id },
  },
  location: { state },
}) => {
  const initialIdea =
    state?.idea || (globalThis as GlobalWithPreloadedIdea).__PRELOADED_IDEA__;

  const { queueSnackbar } = React.useContext(SnackbarContext);

  const handleError = React.useCallback(() => {
    queueSnackbar({
      severity: 'info',
      message:
        'Idea not found. Either the link is incorrect or it was unpublished or deleted.',
    });
  }, [queueSnackbar]);

  return (
    <Suspense fallback={<IdeaContainerSkeleton />}>
      <ErrorBoundary FallbackComponent={RedirectToIdeas} onError={handleError}>
        <IdeaContainer id={id} initialIdea={initialIdea} user={user} />
      </ErrorBoundary>
    </Suspense>
  );
};

export default (props: Omit<IdeaPageProps, 'user'>) => {
  const user = useUserState();

  if (isUserLoading(user)) {
    return <IdeaContainerSkeleton />;
  } else {
    return <IdeaPage {...props} user={user} />;
  }
};
