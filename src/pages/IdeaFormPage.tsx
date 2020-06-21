import { IdeaForm } from 'containers';
import React from 'react';

export interface IdeaFormPageProps {}

export const IdeaFormPage: React.FC<IdeaFormPageProps> = () => (
  <React.Suspense fallback="Loading...">
    <IdeaForm />
  </React.Suspense>
);
