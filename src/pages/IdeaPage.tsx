import { Loading } from 'components';
import { IdeaContainer } from 'containers';
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
    <Suspense fallback={<Loading />}>
      <IdeaContainer
        id={id}
        initialIdea={state?.idea}
        initialReviews={state?.reviews}
      />
    </Suspense>
  );
};
