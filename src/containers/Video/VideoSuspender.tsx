import { Box, useTheme } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { FileOptions } from 'containers';
import { IdeaModel, UpdateIdea } from 'models';
import React from 'react';
import { useComputedHeight } from 'services';
import { Video } from './Video';

export interface VideoSuspenderProps extends Pick<IdeaModel, 'story'> {
  isAuthor: boolean;
  update: UpdateIdea;
}

export const VideoSuspender: React.FC<VideoSuspenderProps> = ({
  story: { path, width, height },
  isAuthor,
  update,
}) => {
  const theme = useTheme();

  const { computedHeight, ref } = useComputedHeight({ width, height });

  return (
    <Box>
      <div
        ref={ref}
        style={{
          backgroundColor: theme.palette.grey[900],
          display: 'flex',
          justifyContent: 'center',
          height: computedHeight,
        }}
      >
        <React.Suspense
          fallback={
            <Skeleton
              variant={'rect'}
              height={'100%'}
              width={'100%'}
              style={{ maxWidth: width }}
            />
          }
        >
          <Video path={path} />
        </React.Suspense>
      </div>
      {isAuthor && <FileOptions update={update} storagePath={'videos'} />}
    </Box>
  );
};
