import { Loading } from 'components';
import { IdeaContainer } from 'containers';
import { IdeaModel, Review } from 'models';
import React, { Suspense } from 'react';
import { RouteComponentProps } from 'react-router-dom';

export interface IdeaPageProps
  extends RouteComponentProps<
    { id: IdeaModel['id'] },
    {},
    { idea?: IdeaModel; reviews?: Review[] }
  > {}

export const IdeaPage: React.FC<IdeaPageProps> = ({
  match: {
    params: { id },
  },
  location: {
    state: { idea, reviews },
  },
}) => {
  return (
    <Suspense fallback={<Loading />}>
      <IdeaContainer id={id} initialIdea={idea} initialReviews={reviews} />
    </Suspense>
  );
};
