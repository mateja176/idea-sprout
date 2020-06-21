import { Box, IconButton, Tooltip } from '@material-ui/core';
import { KeyboardArrowLeft } from '@material-ui/icons';
import { Link, Loading } from 'components';
import { Idea, IdeaContainer } from 'containers';
import { IdeaModel } from 'models';
import React, { Suspense } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { absolutePrivateRoute } from 'utils';
import { Skeleton } from '@material-ui/lab';

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
    <Box my={1}>
      <Box ml={1} display="flex" alignItems="center">
        <Link to={absolutePrivateRoute.ideas.path}>
          <Tooltip placement="top" title="Back to list">
            <IconButton>
              <KeyboardArrowLeft />
            </IconButton>
          </Tooltip>
        </Link>
        <Box ml={2}>{idea?.name ?? <Skeleton />}</Box>
      </Box>
      <Box pt={1} pb={3}>
        {idea ? (
          <Idea {...idea} />
        ) : (
          <Suspense fallback={<Loading />}>
            <IdeaContainer id={id} />
          </Suspense>
        )}
      </Box>
    </Box>
  );
};
