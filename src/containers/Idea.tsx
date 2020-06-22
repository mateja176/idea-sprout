import { Box, Typography } from '@material-ui/core';
import { IdeaModel } from 'models';
import React from 'react';
import { Images } from './Images';
import { FullVideo } from './VideoSuspender';
export interface IdeaProps extends IdeaModel {}

const breakWordStyle: React.CSSProperties = {
  wordBreak: 'break-word',
};

const TitleWrapper: React.FC = ({ children }) => (
  <Box mx={3} my={4}>
    {children}
  </Box>
);

const Section: React.FC = ({ children }) => (
  <TitleWrapper>
    {React.Children.map(children, (child, i) =>
      i === 0 ? <Box mb={2}>{child}</Box> : child,
    )}
  </TitleWrapper>
);

export const Idea: React.FC<IdeaProps> = (idea) => {
  return (
    <Box>
      <FullVideo {...idea.story} />
      <Section>
        <Typography variant="h5">Problem-Solution</Typography>
        <Typography style={breakWordStyle}>{idea.problemSolution}</Typography>
      </Section>
      <Box>
        <TitleWrapper>
          <Typography variant="h5">Images</Typography>
        </TitleWrapper>
        <Images images={idea.images} />
      </Box>
      <Section>
        <Typography variant="h5">Rationale</Typography>
        <Typography style={breakWordStyle}>{idea.rationale}</Typography>
      </Section>
      {/* TODO add call to action for reviewers */}
    </Box>
  );
};
