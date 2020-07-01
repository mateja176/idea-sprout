import 'firebase/firestore';
import { IdeaModel, WithId } from 'models';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { useFirestoreDoc, useIdeasRef } from 'services';
import { absolutePrivateRoute } from 'utils';
import { IdeaForm } from './IdeaForm';

export interface EditIdeaFormProps extends WithId {
  initialIdea?: IdeaModel;
}

export const EditIdeaForm: React.FC<EditIdeaFormProps> = ({
  id,
  initialIdea,
}) => {
  const idea = useFirestoreDoc<IdeaModel>(useIdeasRef().doc(id), {
    startWithValue: initialIdea,
  });

  return idea ? (
    <IdeaForm idea={idea} />
  ) : (
    <Redirect to={absolutePrivateRoute.ideas.path} />
  );
};
