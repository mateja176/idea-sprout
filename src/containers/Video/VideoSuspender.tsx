import { Box, useTheme } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { FileOptions, Video } from 'containers';
import { IdeaModel, StorageFile, UpdateIdea } from 'models';
import React from 'react';

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
          height: `calc(${height / width} * 100vw)`,
          maxHeight: height,
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
