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
    <>
      <Box
        bgcolor={theme.palette.grey[900]}
        display={'flex'}
        justifyContent={'center'}
        height={`calc(100vw * ${height / width})`}
        maxHeight={'100%'}
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
      </Box>
      {isAuthor && (
        <FileOptions
          label={'Choose new video'}
          storagePath={'videos'}
          update={updateStory}
        />
      )}
    </>
  );
};
