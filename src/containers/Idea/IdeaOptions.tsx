import { Box, Button, makeStyles, Tooltip } from '@material-ui/core';
import { ShareMenu } from 'containers';
import { IdeaModel } from 'models';
import React from 'react';
import { useIdeaOptionButtonStyle } from 'services';
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
            flexGrow: 1,
          }}
          classes={{
            label: classes.label,
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
