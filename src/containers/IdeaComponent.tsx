import { Box, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { IdeaModel } from 'models';
import React from 'react';
import { StorageImage } from 'reactfire';

export interface IdeaComponentProps extends IdeaModel {}

const breakWordStyle: React.CSSProperties = {
  wordBreak: 'break-word',
};

const height = 300;

export const IdeaComponent: React.FC<IdeaComponentProps> = (idea) => {
  console.log(idea);
  return (
    <Box p={3}>
      <Box>
        <Typography variant="h5">Story</Typography>
        {idea.storyPath}
      </Box>
      <Box>
        <Typography variant="h5">Problem-Solution</Typography>
        <Typography style={breakWordStyle}>{idea.problemSolution}</Typography>
      </Box>
      <Box>
        <Typography variant="h5">Images</Typography>
        <React.Suspense fallback={<Skeleton variant="rect" height={height} />}>
          {idea.imagePaths.map((url) => (
            <StorageImage key={url} storagePath={url} height={height} />
          ))}
        </React.Suspense>
      </Box>
      <Box>
        <Typography variant="h5">Rationale</Typography>
        <Typography style={breakWordStyle}>{idea.rationale}</Typography>
      </Box>
      {/* TODO add call to action for reviewers */}
    </Box>
  );
};
