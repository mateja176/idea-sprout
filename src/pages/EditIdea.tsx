import { Loading } from 'components';
import { EditForm, IdeaForm } from 'containers';
import { WithId, IdeaModel } from 'models';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { getFormIdea } from 'utils';

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
      {state?.idea ? (
        <IdeaForm initialValues={getFormIdea(state.idea)} />
      ) : (
        <EditForm id={id} />
      )}
    </React.Suspense>
  );
};
