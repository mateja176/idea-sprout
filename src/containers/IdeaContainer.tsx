import { IdeaComponent } from 'containers';
import { IdeaModel } from 'models';
import React from 'react';
import { useFirestore, useFirestoreDocData } from 'reactfire';

export interface IdeaContainerProps extends Pick<IdeaModel, 'id'> {}

export const IdeaContainer: React.FC<IdeaContainerProps> = ({ id }) => {
  const ideaRef = useFirestore().collection('ideas').doc(id);

  const idea = useFirestoreDocData<IdeaModel>(ideaRef);

  return <IdeaComponent {...idea} />;
};
