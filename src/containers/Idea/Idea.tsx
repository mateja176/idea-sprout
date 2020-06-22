import { Box, Typography } from '@material-ui/core';
import { Section } from 'components';
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
      <Section>
        <Typography variant="h5">Problem-Solution</Typography>
        <Typography style={breakWordStyle}>{idea.problemSolution}</Typography>
      </Section>
      <Images images={idea.images} />
      <Section>
        <Typography variant="h5">Rationale</Typography>
        <Typography style={breakWordStyle}>{idea.rationale}</Typography>
      </Section>
    </Box>
  );
};
