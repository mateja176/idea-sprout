import Box from '@material-ui/core/Box';
import { useBoolean } from 'ahooks';
import { SnackbarContext } from 'context/snackbar';
import { absolutePrivateRoute } from 'elements/routes';
import { useFirestoreDoc, useIdeaRef } from 'hooks/firebase';
import { useActions } from 'hooks/hooks';
import { WithMaybeUser } from 'models/auth';
import { IdeaModel, IdeaSprout } from 'models/idea';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { createUpdateIdea } from 'services/store/slices/ideas';
import { Idea, IdeaProps } from './Idea';
import { IdeaMetaTags } from './IdeaMetaTags';
import { IdeaTabs } from './IdeaTabs';

export interface IdeaContainerProps
  extends Pick<IdeaModel, 'id'>,
    WithMaybeUser {
  initialIdea?: IdeaModel;
}

const actionCreators = {
  updateIdea: createUpdateIdea,
};

export const IdeaContainer: React.FC<IdeaContainerProps> = ({
  id,
  initialIdea,
  user,
}) => {
  const { updateIdea } = useActions(actionCreators);

  const { queueSnackbar } = React.useContext(SnackbarContext);

  const ideaRef = useIdeaRef(id);

  const idea = useFirestoreDoc<IdeaModel>(ideaRef, {
    startWithValue: initialIdea,
  });

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

  const [showName, setShowName] = useBoolean();

  const handleScroll: React.UIEventHandler<HTMLDivElement> = React.useCallback(
    (e) => {
      setShowName.toggle((e.target as HTMLDivElement).scrollTop > 0);
    },
    [setShowName],
  );

  return idea ? (
    <Box
      flex={1}
      display={'flex'}
      flexDirection={'column'}
      overflow={'auto'}
      onScroll={handleScroll}
    >
      <IdeaMetaTags idea={idea} />
      <IdeaTabs user={user} idea={idea} showName={showName} update={update} />
      <Idea user={user} idea={idea} update={update} />
    </Box>
  ) : (
    <Redirect to={absolutePrivateRoute.ideas.path} />
  );
};
