import { IdeaForm } from 'containers';
import { initialIdea } from 'models';
import React from 'react';

export interface CreateIdeaProps {}

export const CreateIdea: React.FC<CreateIdeaProps> = () => (
  <IdeaForm idea={initialIdea} />
);
