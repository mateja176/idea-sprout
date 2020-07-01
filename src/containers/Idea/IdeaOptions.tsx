import {
  Box,
  Button,
  Hidden,
  Icon,
  makeStyles,
  Tooltip,
} from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { ShareMenu } from 'containers';
import { IdeaModel } from 'models';
import { isNil } from 'ramda';
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
  expanded?: boolean;
  toggleExpanded?: () => void;
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
  expanded,
  toggleExpanded = () => {},
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
      <Tooltip placement="top" title={idea.name}>
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
          onClick={toggleExpanded}
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
            {!isNil(expanded) && (
              <Hidden xsDown>
                <Icon color={'action'} style={{ display: 'flex' }}>
                  {expanded ? <ExpandLess /> : <ExpandMore />}
                </Icon>
              </Hidden>
            )}
          </Box>
        </Button>
      </Tooltip>
    </Box>
  );
};
