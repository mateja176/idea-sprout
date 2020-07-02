import { Box, Tooltip, useTheme } from '@material-ui/core';
import { IdeaPreviewWrapper } from 'components';
import { IdeaImagePreview, ShareMenu } from 'containers';
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

export const IdeaOptions: React.FC<IdeaOptionsProps> = ({
  idea,
  ideaUrl,
  toggleReviewsOpen,
  configButton,
  navigationButton,
}) => {
  const theme = useTheme();

  const history = useHistory();

  const borderColor = theme.palette.grey[600];

  const buttonStyle = useIdeaOptionButtonStyle();

  return (
    <Box
      display="flex"
      alignItems="center"
      width="100%"
      style={{
        cursor: 'pointer',
      }}
      onClick={() => {
        history.push(urljoin(absolutePrivateRoute.ideas.path, idea.id));
      }}
    >
      <Box mr={1}>
        <React.Suspense fallback={<IdeaPreviewWrapper />}>
          <IdeaImagePreview path={idea.images[0].path} />
        </React.Suspense>
      </Box>
      <Box
        mr={1}
        style={{
          flexGrow: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          wordBreak: 'break-word',
          display: '-webkit-box',
          WebkitLineClamp: 4,
          WebkitBoxOrient: 'vertical',
        }}
      >
        <Tooltip placement="top" title={idea.name}>
          <span style={{ fontSize: '1.2em' }}>{idea.name}</span>
        </Tooltip>
        <br />
        <Tooltip placement="top" title={idea.problemSolution}>
          <span style={{ color: theme.palette.text.secondary }}>
            {idea.problemSolution}
          </span>
        </Tooltip>
      </Box>
      <IdeaPreviewWrapper>
        <Box
          width={'100%'}
          height={'100%'}
          border={`1px solid ${borderColor}`}
          borderRadius={5}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Box
            display="flex"
            width={'100%'}
            height={'50%'}
            borderBottom={`1px solid ${borderColor}`}
          >
            <Box
              width={'50%'}
              height={'100%'}
              borderRight={`1px solid ${borderColor}`}
            >
              <ShareMenu
                style={buttonStyle}
                shareCount={idea.sharedBy.length}
                url={ideaUrl}
              />
            </Box>
            <Box width={'50%'} height={'100%'}>
              <React.Suspense fallback={<IdeaDoubleOptionSkeleton />}>
                <IdeaRatingOption id={idea.id} onClick={toggleReviewsOpen} />
              </React.Suspense>
            </Box>
          </Box>
          <Box display="flex" width={'100%'} height={'50%'}>
            <Box
              width={'50%'}
              height={'100%'}
              borderRight={`1px solid ${borderColor}`}
            >
              {configButton}
            </Box>
            <Box width={'50%'} height={'100%'}>
              {navigationButton}
            </Box>
          </Box>
        </Box>
      </IdeaPreviewWrapper>
    </Box>
  );
};
