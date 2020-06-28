import { Box, Typography } from '@material-ui/core';
import { IdeaSection } from 'components';
import { IdeaModel } from 'models';
import React from 'react';
import { breakWordStyle } from 'styles';
import { Images } from '../Image';
import { VideoSuspender } from '../Video';

export interface IdeaProps extends IdeaModel {}

export const Idea: React.FC<IdeaProps> = (idea) => {
  return (
    <Box>
      <VideoSuspender {...idea.story} />
      <IdeaSection>
        <Typography variant="h5">Problem-Solution</Typography>
        <Typography style={breakWordStyle}>{idea.problemSolution}</Typography>
      </IdeaSection>
      <Images images={idea.images} />
      <IdeaSection>
        <Typography variant="h5">Rationale</Typography>
        <Typography style={breakWordStyle}>{idea.rationale}</Typography>
      </IdeaSection>
    </Box>
  );
};
