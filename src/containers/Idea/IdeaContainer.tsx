import { Idea } from 'containers';
import { IdeaModel } from 'models';
import React from 'react';
import { useFirestoreDocData } from 'reactfire';
import { useIdeas } from 'services';

export interface IdeaContainerProps extends Pick<IdeaModel, 'id'> {}

export const IdeaContainer: React.FC<IdeaContainerProps> = ({ id }) => {
  const ideaRef = useIdeas().doc(id);

  const idea = useFirestoreDocData<IdeaModel>(ideaRef);

  return <Idea {...idea} />;
};
