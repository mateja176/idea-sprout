import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { RouteComponentProps } from 'react-router-dom';
import RedirectToIdeas from '../../../../components/Idea/RedirectToIdeas';
import { IdeaContainer } from '../../../../containers/Idea/IdeaContainer';
import { IdeaContainerSkeleton } from '../../../../containers/Idea/IdeaContainerSkeleton';
import { SnackbarContext } from '../../../../context/snackbar';
import { useUser } from '../../../../hooks/firebase';
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
  const user = useUser();

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
    <React.Suspense fallback={<IdeaContainerSkeleton />}>
      <ErrorBoundary FallbackComponent={RedirectToIdeas} onError={handleError}>
        <IdeaContainer id={id} initialIdea={initialIdea} user={user} />
      </ErrorBoundary>
    </React.Suspense>
  );
};

export default (props: IdeaPageProps) => {
  return (
    <React.Suspense fallback={<IdeaContainerSkeleton />}>
      <IdeaPage {...props} />
    </React.Suspense>
  );
};
