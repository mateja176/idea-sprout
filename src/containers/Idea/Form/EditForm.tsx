import { RawIdea, WithId } from 'models';
import React from 'react';
import { useFirestoreDocDataOnce } from 'reactfire';
import { useIdeasRef } from 'services';
import { getFormIdea, absolutePrivateRoute } from 'utils';
import { IdeaForm } from './Form';
import { Redirect } from 'react-router-dom';

export interface EditFormProps extends WithId {}

export const EditForm: React.FC<EditFormProps> = ({ id }) => {
  const ideaRef = useIdeasRef().doc(id);

  const idea = useFirestoreDocDataOnce<RawIdea>(ideaRef);

  return idea.name ? (
    <IdeaForm initialValues={getFormIdea(idea)} />
  ) : (
    <Redirect to={absolutePrivateRoute.ideas.path} />
  );
};
