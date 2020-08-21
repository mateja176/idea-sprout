import { IdeaContainer } from 'containers/Idea/IdeaContainer';
import { IdeaContainerSkeleton } from 'containers/Idea/IdeaContainerSkeleton';
import { useUserState } from 'hooks/firebase';
import { WithMaybeUser } from 'models/auth';
import { GlobalWithPreloadedIdea, IdeaModel } from 'models/idea';
import React, { Suspense } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { isUserLoading } from 'utils/auth';

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

  return (
    <Suspense fallback={<IdeaContainerSkeleton />}>
      <IdeaContainer id={id} initialIdea={initialIdea} user={user} />
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
