import { Box } from '@material-ui/core';
import { Idea } from 'containers';
import 'firebase/firestore';
import { IdeaModel, IdeaSprout } from 'models';
import React from 'react';
import { Redirect } from 'react-router-dom';
import {
  createQueueSnackbar,
  createUpdateIdea,
  useActions,
  useFirestoreDoc,
  useIdeasRef,
  useSignedInUser,
} from 'services';
import { absolutePrivateRoute } from 'utils';
import { IdeaProps } from './Idea';
import { IdeaTabs } from './IdeaTabs';

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

  const user = useSignedInUser();

  const idea = useFirestoreDoc<IdeaModel>(useIdeasRef().doc(id), {
    startWithValue: initialIdea,
  });

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
    <Box flex={1} display={'flex'} flexDirection={'column'} overflow={'auto'}>
      <IdeaTabs user={user} idea={idea} />
      <Idea user={user} idea={idea} update={update} />
    </Box>
  ) : (
    <Redirect to={absolutePrivateRoute.ideas.path} />
  );
};
