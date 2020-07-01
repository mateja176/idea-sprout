import { Box, Button, makeStyles, Tooltip } from '@material-ui/core';
import { ShareMenu } from 'containers';
import { IdeaModel } from 'models';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useIdeaOptionButtonStyle } from 'services';
import urljoin from 'url-join';
import { absolutePrivateRoute } from 'utils';
import { IdeaDoubleOptionSkeleton } from './IdeaOptionsSkeleton';
import { IdeaRatingOption } from './IdeaRatingOption';

export interface IdeaOptionsProps {
  idea: IdeaModel;
  ideaUrl: string;
  toggleReviewsOpen: () => void;
  configButton: React.ReactElement;
  navigationButton: React.ReactElement;
}

const useStyles = makeStyles((theme) => ({
  label: {
    marginLeft: theme.spacing(1),
    textAlign: 'initial',
    display: 'inline-block',
    overflowX: 'hidden',
  },
}));

export const IdeaOptions: React.FC<IdeaOptionsProps> = ({
  idea,
  ideaUrl,
  toggleReviewsOpen,
  configButton,
  navigationButton,
}) => {
  const classes = useStyles();

  const buttonStyle = useIdeaOptionButtonStyle();

  const history = useHistory();

  return (
    <Box display="flex" alignItems="center" width="100%">
      <ShareMenu
        style={buttonStyle}
        shareCount={idea.sharedBy.length}
        url={ideaUrl}
      />
      <React.Suspense fallback={<IdeaDoubleOptionSkeleton />}>
        <IdeaRatingOption id={idea.id} onClick={toggleReviewsOpen} />
      </React.Suspense>
      {configButton}
      {navigationButton}
      <Tooltip placement="top-start" title={idea.name}>
        <Button
          style={{
            ...buttonStyle,
            textTransform: 'capitalize',
            fontWeight: 400,
          }}
          classes={{
            label: classes.label,
          }}
          onClick={() => {
            history.push(urljoin(absolutePrivateRoute.ideas.path, idea.id));
          }}
        >
          <Box display="flex" alignItems="center">
            <Box
              flex={1}
              textOverflow={'ellipsis'}
              whiteSpace={'nowrap'}
              overflow={'hidden'}
            >
              {idea.name}
            </Box>
          </Box>
        </Button>
      </Tooltip>
    </Box>
  );
};
