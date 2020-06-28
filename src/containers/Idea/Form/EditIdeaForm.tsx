import { IdeaModel, WithId } from 'models';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { useFirestoreDoc, useIdeasRef } from 'services';
import { absolutePrivateRoute } from 'utils';
import { IdeaForm } from './IdeaForm';

export interface EditIdeaFormProps extends WithId {
  initialIdea?: IdeaModel;
}

export const EditIdeaForm: React.FC<EditIdeaFormProps> = ({ id }) => {
  const ideaRef = useIdeasRef().doc(id);

  const idea = useFirestoreDoc<IdeaModel>(ideaRef);

  return idea.name ? (
    <IdeaForm idea={idea} />
  ) : (
    <Redirect to={absolutePrivateRoute.ideas.path} />
  );
};
