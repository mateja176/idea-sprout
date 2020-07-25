import { Box, useTheme } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { FileOptions, Video, YoutubeVideo } from 'containers';
import { IdeaModel, StorageFile, storagePath, UpdateIdea } from 'models';
import React from 'react';
import { EmbedVideo } from './EmbedVideo';

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
    (story: StorageFile) => update({ story }),
    [update],
  );

  const skeleton = (
    <Skeleton
      variant={'rect'}
      height={'100%'}
      width={'100%'}
      style={{ maxWidth: width }}
    />
  );

  const isStoragePath = path.startsWith(storagePath.videos);

  const Embed: React.FC<Omit<
    React.ComponentProps<typeof EmbedVideo>,
    'update' | 'label'
  >> = React.useCallback(
    (props) => <EmbedVideo {...props} update={updateStory} label={'Embed'} />,
    [updateStory],
  );

  return (
    <>
      <Box
        bgcolor={theme.palette.grey[900]}
        display={'flex'}
        justifyContent={'center'}
        height={isStoragePath ? `calc(100vw * ${height / width})` : height}
        maxHeight={'100%'}
      >
        {isStoragePath ? (
          <React.Suspense fallback={skeleton}>
            <Video path={path} />
          </React.Suspense>
        ) : (
          <YoutubeVideo path={path}>{skeleton}</YoutubeVideo>
        )}
      </Box>
      {isAuthor && (
        <FileOptions
          label={'New video'}
          storagePath={'videos'}
          update={updateStory}
          Embed={Embed}
        />
      )}
    </>
  );
};
