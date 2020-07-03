import { Box, Button, Tooltip } from '@material-ui/core';
import { OpenInBrowser } from '@material-ui/icons';
import { IdeaOptionsWrapper } from 'components';
import { IdeaOptions } from 'containers';
import 'firebase/firestore';
import { IdeaModel, User } from 'models';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useIdeaUrl } from 'services';
import urljoin from 'url-join';
import { absolutePrivateRoute } from 'utils';

export interface IdeaRowProps {
  idea: IdeaModel;
  user: User;
}

export const IdeaRow: React.FC<IdeaRowProps> = ({ idea, user }) => {
  const history = useHistory();

  const ideaUrl = useIdeaUrl(idea.id);

  return (
    <Box key={idea.id}>
      <IdeaOptionsWrapper key={idea.id}>
        <IdeaOptions
          user={user}
          idea={idea}
          ideaUrl={ideaUrl}
          NavigationButton={({ style }) => (
            <Tooltip placement={'top'} title={'Open in full'}>
              <Button
                style={style}
                onClick={() => {
                  history.push(
                    urljoin(absolutePrivateRoute.ideas.path, idea.id),
                    { idea },
                  );
                }}
              >
                <OpenInBrowser />
              </Button>
            </Tooltip>
          )}
        />
      </IdeaOptionsWrapper>
    </Box>
  );
};
