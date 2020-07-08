import { Box, Button, Tooltip } from '@material-ui/core';
import { KeyboardArrowLeft } from '@material-ui/icons';
import { IdeaOptionsWrapper } from 'components';
import { Idea } from 'containers';
import 'firebase/firestore';
import { IdeaModel } from 'models';
import React from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import {
  createQueueSnackbar,
  useActions,
  useFirestoreDoc,
  useIdeasRef,
  useIdeaUrl,
  useSignedInUser,
} from 'services';
import { ideaMarginBottom, pageMargin } from 'styles';
import { absolutePrivateRoute } from 'utils';
import { IdeaProps } from './Idea';
import { IdeaOptions } from './IdeaOptions';

export interface IdeaContainerProps extends Pick<IdeaModel, 'id'> {
  initialIdea?: IdeaModel;
}

export const IdeaContainer: React.FC<IdeaContainerProps> = ({
  id,
  initialIdea,
}) => {
  const { queueSnackbar } = useActions({ queueSnackbar: createQueueSnackbar });

  const history = useHistory();

  const user = useSignedInUser();

  const idea = useFirestoreDoc<IdeaModel>(useIdeasRef().doc(id), {
    startWithValue: initialIdea,
  });

  const ideaUrl = useIdeaUrl(id);

  const ideaRef = useIdeasRef().doc(id);

  const updateIdea: IdeaProps['update'] = (partialIdea) => {
    return ideaRef.update(partialIdea).then(() => {
      queueSnackbar({
        severity: 'success',
        message: 'Update successful',
        autoHideDuration: 2000,
      });
    });
  };

  return idea ? (
    <Box mt={pageMargin} mb={ideaMarginBottom}>
      <IdeaOptionsWrapper>
        <IdeaOptions
          email={user.email}
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
      </IdeaOptionsWrapper>
      <Idea user={user} idea={idea} update={updateIdea} />
    </Box>
  ) : (
    <Redirect to={absolutePrivateRoute.ideas.path} />
  );
};
