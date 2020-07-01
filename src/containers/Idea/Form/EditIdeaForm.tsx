import firebase from 'firebase/app';
import 'firebase/firestore';
import { IdeaModel, WithId } from 'models';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { useFirestoreDoc } from 'services';
import { absolutePrivateRoute, firestoreCollections } from 'utils';
import { IdeaForm } from './IdeaForm';

export interface EditIdeaFormProps extends WithId {
  initialIdea?: IdeaModel;
}

export const EditIdeaForm: React.FC<EditIdeaFormProps> = ({
  id,
  initialIdea,
}) => {
  const idea = useFirestoreDoc<IdeaModel>(
    firebase.firestore().collection(firestoreCollections.ideas.path).doc(id),
    {
      startWithValue: initialIdea,
    },
  );

  return idea.name ? (
    <IdeaForm idea={idea} />
  ) : (
    <Redirect to={absolutePrivateRoute.ideas.path} />
  );
};
