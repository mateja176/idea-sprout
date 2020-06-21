import { Box, IconButton, Tooltip } from '@material-ui/core';
import { KeyboardArrowLeft } from '@material-ui/icons';
import { Link, PageWrapper } from 'components';
import { Idea, IdeaContainer } from 'containers';
import { IdeaModel } from 'models';
import React, { Suspense } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { absolutePrivateRoute } from 'utils';

export interface IdeaPageProps
  extends RouteComponentProps<
    { id: IdeaModel['id'] },
    {},
    IdeaModel | undefined
  > {}

export const IdeaPage: React.FC<IdeaPageProps> = ({
  match: {
    params: { id },
  },
  location: { state: idea },
}) => {
  return (
    <PageWrapper>
      <Link to={absolutePrivateRoute.ideas.path}>
        <Tooltip placement="top" title="Back to list">
          <IconButton>
            <KeyboardArrowLeft />
          </IconButton>
        </Tooltip>
      </Link>
      {idea ? (
        <Idea {...idea} />
      ) : (
        <Suspense fallback={<Box>Loading...</Box>}>
          <IdeaContainer id={id} />
        </Suspense>
      )}
    </PageWrapper>
  );
};
