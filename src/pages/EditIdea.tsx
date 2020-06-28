import { Loading } from 'components';
import { EditIdeaForm } from 'containers';
import { IdeaModel, WithId } from 'models';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

export interface EditIdeaProps
  extends RouteComponentProps<WithId, {}, { idea: IdeaModel } | null> {}

export const EditIdea: React.FC<EditIdeaProps> = ({
  match: {
    params: { id },
  },
  location: { state },
}) => {
  return (
    <React.Suspense fallback={<Loading />}>
      <EditIdeaForm id={id} initialIdea={state?.idea} />
    </React.Suspense>
  );
};
