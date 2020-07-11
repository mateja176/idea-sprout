import { Box, Button } from '@material-ui/core';
import { OpenInBrowser } from '@material-ui/icons';
import { IdeaOptions } from 'containers';
import 'firebase/firestore';
import { IdeaModel, User } from 'models';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useIdeaUrl } from 'services';
import urljoin from 'url-join';
import { absolutePrivateRoute } from 'utils';

export interface IdeaRowProps extends Pick<User, 'email' | 'uid'> {
  idea: IdeaModel;
}

export const IdeaRow = React.memo<IdeaRowProps>(({ idea, email, uid }) => {
  const history = useHistory();

  const ideaUrl = useIdeaUrl(idea.id);

  const openInFull = React.useCallback(() => {
    history.push(urljoin(absolutePrivateRoute.ideas.path, idea.id), {
      idea,
    });
  }, [history, idea]);

  const NavigationButton = React.useCallback(
    ({ style }) => (
      <Button title={'Open in full'} style={style} onClick={openInFull}>
        <OpenInBrowser />
      </Button>
    ),
    [openInFull],
  );

  return (
    <Box key={idea.id}>
      <IdeaOptions
        email={email}
        uid={uid}
        idea={idea}
        ideaUrl={ideaUrl}
        NavigationButton={NavigationButton}
      />
    </Box>
  );
});
