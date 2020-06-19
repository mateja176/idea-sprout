import { Box, Typography } from '@material-ui/core';
import { IdeaModel } from 'models';
import React from 'react';

export interface IdeaProps extends IdeaModel {}

const breakWordStyle: React.CSSProperties = {
  wordBreak: 'break-word',
};

export const Idea: React.FC<IdeaProps> = (idea) => (
  <Box p={3}>
    <Box>
      <Typography variant="h5">Story</Typography>
      {idea.storyURL}
    </Box>
    <Box>
      <Typography variant="h5">Problem-Solution</Typography>
      <Typography style={breakWordStyle}>{idea.problemSolution}</Typography>
    </Box>
    <Box>
      <Typography variant="h5">Images</Typography>
      {idea.imageURLs}
    </Box>
    <Box>
      <Typography variant="h5">Rationale</Typography>
      <Typography style={breakWordStyle}>{idea.rationale}</Typography>
    </Box>
    {/* TODO add call to action for reviewers */}
  </Box>
);
