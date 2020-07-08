import { Box, Button, Tooltip } from '@material-ui/core';
import { OpenInBrowser } from '@material-ui/icons';
import { IdeaOptionsWrapper } from 'components';
import { IdeaOptions } from 'containers';
import 'firebase/firestore';
import { IdeaModel, User } from 'models';
import { equals } from 'ramda';
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

  const NavigationButton = React.useCallback(
    ({ style }) => (
      <Tooltip placement={'top'} title={'Open in full'}>
        <Button
          style={style}
          onClick={() => {
            history.push(urljoin(absolutePrivateRoute.ideas.path, idea.id), {
              idea,
            });
          }}
        >
          <OpenInBrowser />
        </Button>
      </Tooltip>
    ),
    [history, idea],
  );

  return (
    <Box key={idea.id}>
      <IdeaOptionsWrapper key={idea.id}>
        <IdeaOptions
          email={email}
          uid={uid}
          idea={idea}
          ideaUrl={ideaUrl}
          NavigationButton={NavigationButton}
        />
      </IdeaOptionsWrapper>
    </Box>
  );
}, equals);
