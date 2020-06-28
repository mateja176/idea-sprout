import { Loading } from 'components';
import { IdeaForm } from 'containers';
import { initialIdea } from 'models';
import React from 'react';

export interface CreateIdeaProps {}

export const CreateIdea: React.FC<CreateIdeaProps> = () => (
  <React.Suspense fallback={<Loading />}>
    <IdeaForm idea={initialIdea} />
  </React.Suspense>
);
