import { RawIdea, WithId } from 'models';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { useFirestoreDocDataOnce } from 'reactfire';
import { useIdeasRef } from 'services';
import { absolutePrivateRoute, getFormIdea } from 'utils';
import { IdeaForm } from './IdeaForm';

export interface EditIdeaFormProps extends WithId {}

export const EditIdeaForm: React.FC<EditIdeaFormProps> = ({ id }) => {
  const ideaRef = useIdeasRef().doc(id);

  const idea = useFirestoreDocDataOnce<RawIdea>(ideaRef);

  return idea.name ? (
    <IdeaForm initialValues={getFormIdea(idea)} />
  ) : (
    <Redirect to={absolutePrivateRoute.ideas.path} />
  );
};
