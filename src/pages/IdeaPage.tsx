import { Box } from '@material-ui/core';
import { IdeaContainer } from 'containers';
import { IdeaModel } from 'models';
import React, { Suspense } from 'react';
import { RouteComponentProps } from 'react-router-dom';

export interface IdeaPageProps
  extends RouteComponentProps<{ id: IdeaModel['id'] }> {}

export const IdeaPage: React.FC<IdeaPageProps> = ({
  match: {
    params: { id },
  },
}) => {
  return (
    <Suspense fallback={<Box>Loading...</Box>}>
      <IdeaContainer id={id} />
    </Suspense>
  );
};
