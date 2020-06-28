import { Box, Typography } from '@material-ui/core';
import { IdeaSection } from 'components';
import { problemSolutionTitle, rationaleTitle } from 'elements';
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
        {problemSolutionTitle}
        <Typography style={breakWordStyle}>{idea.problemSolution}</Typography>
      </IdeaSection>
      <Images images={idea.images} />
      <IdeaSection>
        {rationaleTitle}
        <Typography style={breakWordStyle}>{idea.rationale}</Typography>
      </IdeaSection>
    </Box>
  );
};
