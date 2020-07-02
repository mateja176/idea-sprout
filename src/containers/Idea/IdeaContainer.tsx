import { Box, Button, Tooltip } from '@material-ui/core';
import { KeyboardArrowLeft } from '@material-ui/icons';
import { IdeaOptionsWrapper } from 'components';
import { Idea } from 'containers';
import 'firebase/firestore';
import { IdeaModel } from 'models';
import React from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { useFirestoreDoc, useIdeasRef, useIdeaUrl } from 'services';
import { ideaMarginBottom, pageMargin } from 'styles';
import { absolutePrivateRoute } from 'utils';
import { IdeaOptions } from './IdeaOptions';

export interface IdeaContainerProps extends Pick<IdeaModel, 'id'> {
  initialIdea?: IdeaModel;
}

export const IdeaContainer: React.FC<IdeaContainerProps> = ({
  id,
  initialIdea,
}) => {
  const history = useHistory();

  const idea = useFirestoreDoc<IdeaModel>(useIdeasRef().doc(id), {
    startWithValue: initialIdea,
  });

  const ideaUrl = useIdeaUrl(id);

  return idea ? (
    <Box mt={pageMargin} mb={ideaMarginBottom}>
      <IdeaOptionsWrapper>
        <IdeaOptions
          idea={idea}
          ideaUrl={ideaUrl}
          navigationButton={({ style }) => (
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
      <Idea {...idea} />
    </Box>
  ) : (
    <Redirect to={absolutePrivateRoute.ideas.path} />
  );
};
