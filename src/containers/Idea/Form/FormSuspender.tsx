import { Loading } from 'components';
import React from 'react';
import { IdeaForm } from './Form';

export interface IdeaFormSuspenderProps {}

export const IdeaFormSuspender: React.FC<IdeaFormSuspenderProps> = () => (
  <React.Suspense fallback={<Loading />}>
    <IdeaForm />
  </React.Suspense>
);
