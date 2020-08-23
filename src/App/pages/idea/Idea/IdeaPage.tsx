import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { RouteComponentProps } from 'react-router-dom';
import RedirectToIdeas from '../../../../components/Idea/RedirectToIdeas';
import { IdeaContainer } from '../../../../containers/Idea/IdeaContainer';
import { IdeaContainerSkeleton } from '../../../../containers/Idea/IdeaContainerSkeleton';
import { SnackbarContext } from '../../../../context/snackbar';
import { useMaybeUser } from '../../../../hooks/firebase';
import { GlobalWithPreloadedIdea, IdeaModel } from '../../../../models/idea';

export interface IdeaPageProps
  extends RouteComponentProps<
    { id: IdeaModel['id'] },
    {},
    { idea: IdeaModel } | null
  > {}

const IdeaPage: React.FC<IdeaPageProps> = ({
  match: {
    params: { id },
  },
  location: { state },
}) => {
  const user = useMaybeUser();

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

  const ideaContainer = (
    <ErrorBoundary FallbackComponent={RedirectToIdeas} onError={handleError}>
      <IdeaContainer id={id} initialIdea={initialIdea} user={user} />
    </ErrorBoundary>
  );

  return initialIdea ? (
    ideaContainer
  ) : (
    <React.Suspense fallback={<IdeaContainerSkeleton />}>
      {ideaContainer}
    </React.Suspense>
  );
};

export default IdeaPage;
