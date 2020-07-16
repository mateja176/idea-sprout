import { Box, Button, Tab, Tabs, Tooltip, useTheme } from '@material-ui/core';
import { Edit, KeyboardArrowLeft } from '@material-ui/icons';
import { Idea } from 'containers';
import 'firebase/firestore';
import { headingIds, IdeaModel, IdeaSprout } from 'models';
import React from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import {
  createQueueSnackbar,
  createUpdateIdea,
  useActions,
  useFirestoreDoc,
  useIdeasRef,
  useIdeaUrl,
  useLinkStyle,
  useSignedInUser,
} from 'services';
import { ideaMarginBottom } from 'styles';
import { absolutePrivateRoute } from 'utils';
import { BackToIdeas } from './BackToIdeas';
import { IdeaProps } from './Idea';
import { IdeaOptions } from './IdeaOptions';

export interface IdeaContainerProps extends Pick<IdeaModel, 'id'> {
  initialIdea?: IdeaModel;
}

export const IdeaContainer: React.FC<IdeaContainerProps> = ({
  id,
  initialIdea,
}) => {
  const { queueSnackbar, updateIdea } = useActions({
    queueSnackbar: createQueueSnackbar,
    updateIdea: createUpdateIdea,
  });

  const history = useHistory();

  const theme = useTheme();

  const linkStyle = useLinkStyle();

  const user = useSignedInUser();

  const idea = useFirestoreDoc<IdeaModel>(useIdeasRef().doc(id), {
    startWithValue: initialIdea,
  });

  const ideaUrl = useIdeaUrl(id);

  const ideaRef = useIdeasRef().doc(id);

  const update: IdeaProps['update'] = React.useCallback(
    (partialIdea) => {
      return ideaRef.update(partialIdea).then(() => {
        queueSnackbar({
          severity: 'success',
          message: 'Update successful',
          autoHideDuration: 2000,
        });

        if (idea?.status === 'sprout') {
          updateIdea({ id, ...(partialIdea as Partial<IdeaSprout>) });
        }
      });
    },
    [id, idea, ideaRef, queueSnackbar, updateIdea],
  );

  return idea ? (
    <Box mb={ideaMarginBottom}>
      <Tabs value={false} variant="fullWidth">
        <BackToIdeas />
        <Tab
          classes={linkStyle}
          label={
            user.uid === idea.author ? (
              <HashLink
                to={history.location.pathname
                  .concat('#')
                  .concat(headingIds.problemSolution)}
                smooth
              >
                <Box display={'flex'} color={theme.palette.action.active}>
                  <Edit />
                  &nbsp; Edit Idea
                </Box>
              </HashLink>
            ) : null
          }
        />
      </Tabs>
      <IdeaOptions
        uid={user.uid}
        idea={idea}
        ideaUrl={ideaUrl}
        NavigationButton={({ style }) => (
          <Tooltip placement="top" title="Back to ideas">
            <Button
              style={style}
              onClick={() => {
                history.push(absolutePrivateRoute.ideas.path);
              }}
            >
              <KeyboardArrowLeft />
            </Button>
          </Tooltip>
        )}
      />
      <Idea user={user} idea={idea} update={update} />
    </Box>
  ) : (
    <Redirect to={absolutePrivateRoute.ideas.path} />
  );
};
