import Box from '@material-ui/core/Box';
import useTheme from '@material-ui/core/styles/useTheme';
import Skeleton from '@material-ui/lab/Skeleton';
import React from 'react';
import { FileOptions } from '../../containers/FileOptions';
import { YoutubeVideo } from '../../containers/YoutubeVideo';
import { PreloadContext } from '../../context/preload';
import { ideaSelector } from '../../elements/idea/tour';
import { storagePath } from '../../models/firebase';
import { IdeaModel, StorageFile, UpdateIdea } from '../../models/idea';
import { mediaBgGreyVariant } from '../../utils/styles/styles';
import { EmbedVideo } from './EmbedVideo';
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
  const preloaded = React.useContext(PreloadContext);

  const theme = useTheme();

  const updateStory = React.useCallback(
    (story: StorageFile) => update({ story }),
    [update],
  );

  const skeletonStyle: React.CSSProperties = React.useMemo(
    () => ({ maxWidth: width }),
    [width],
  );

  const skeleton = (
    <Skeleton
      variant={'rect'}
      height={'100%'}
      width={'100%'}
      style={skeletonStyle}
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
        id={ideaSelector.story}
        bgcolor={theme.palette.grey[mediaBgGreyVariant]}
        display={'flex'}
        justifyContent={'center'}
        height={isStoragePath ? `calc(100vw * ${height / width})` : height}
        maxHeight={'100%'}
      >
        {preloaded.storyUrl ? (
          <video controls width={'100%'} src={preloaded.storyUrl} />
        ) : isStoragePath ? (
          <React.Suspense fallback={skeleton}>
            <Video path={path} />
          </React.Suspense>
        ) : (
          <YoutubeVideo path={path} width={width} />
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
