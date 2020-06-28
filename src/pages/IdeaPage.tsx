import { IdeaContainer } from 'containers';
import { IdeaContainerSkeleton } from 'containers/Idea/IdeaContainerSkeleton';
import { IdeaModel, Review } from 'models';
import React, { Suspense } from 'react';
import { RouteComponentProps } from 'react-router-dom';

export interface IdeaPageProps
  extends RouteComponentProps<
    { id: IdeaModel['id'] },
    {},
    { idea: IdeaModel; reviews: Review[] } | null
  > {}

export const IdeaPage: React.FC<IdeaPageProps> = ({
  match: {
    params: { id },
  },
  location: { state },
}) => {
  return (
    <Suspense fallback={<IdeaContainerSkeleton />}>
      <IdeaContainer
        id={id}
        initialIdea={state?.idea}
        initialReviews={state?.reviews}
      />
    </Suspense>
  );
};
