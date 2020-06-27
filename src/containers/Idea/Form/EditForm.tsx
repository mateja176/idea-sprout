import { RawIdea, WithId } from 'models';
import React from 'react';
import { useFirestoreDocDataOnce } from 'reactfire';
import { useIdeasRef } from 'services';
import { getFormIdea } from 'utils';
import { IdeaForm } from './Form';

export interface EditFormProps extends WithId {}

export const EditForm: React.FC<EditFormProps> = ({ id }) => {
  const ideaRef = useIdeasRef().doc(id);

  const idea = useFirestoreDocDataOnce<RawIdea>(ideaRef);

  return <IdeaForm initialValues={getFormIdea(idea)} />;
};