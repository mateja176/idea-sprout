import { Box, useTheme } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { FileOptions } from 'containers';
import { IdeaModel, StorageFile, UpdateIdea } from 'models';
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

  const computedHeight = useComputedHeight({ width, height });

  const updateStory = React.useCallback(
    (story: StorageFile) => {
      update({ story });
    },
    [update],
  );

  return (
    <Box>
      <div
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
      {isAuthor && (
        <FileOptions
          label={'Choose new video'}
          storagePath={'videos'}
          update={updateStory}
        />
      )}
    </Box>
  );
};
