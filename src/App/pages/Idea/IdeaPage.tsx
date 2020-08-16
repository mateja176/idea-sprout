import { IdeaContainer } from 'containers/Idea/IdeaContainer';
import { IdeaContainerSkeleton } from 'containers/Idea/IdeaContainerSkeleton';
import { useUserState } from 'hooks/firebase';
import { WithUser } from 'models/auth';
import { IdeaModel } from 'models/idea';
import React, { Suspense } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { isUserLoading } from 'utils/auth';

const Signin = React.lazy(() => import('../Signin'));

export interface IdeaPageProps
  extends WithUser,
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
  return (
    <Suspense fallback={<IdeaContainerSkeleton />}>
      <IdeaContainer id={id} initialIdea={state?.idea} user={user} />
    </Suspense>
  );
};

export default (props: Omit<IdeaPageProps, 'user'>) => {
  const user = useUserState();

  if (isUserLoading(user)) {
    return <IdeaContainerSkeleton />;
  } else if (user === null || !user.emailVerified) {
    return (
      <React.Suspense fallback={<IdeaContainerSkeleton />}>
        <Signin user={user} />
      </React.Suspense>
    );
  } else {
    return <IdeaPage {...props} user={user} />;
  }
};
