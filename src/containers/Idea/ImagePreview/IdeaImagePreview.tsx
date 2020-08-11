import Box from '@material-ui/core/Box';
import Skeleton from '@material-ui/lab/Skeleton';
import useBoolean from 'ahooks/es/useBoolean';
import { IdeaPreviewWrapper } from 'components/Idea/IdeaPreviewWrapper';
import { useStorageDownloadUrl } from 'hooks/firebase';
import { StorageFile } from 'models/idea';
import React from 'react';
import { useStorage } from 'reactfire';
import { ideaListItemHeight } from 'utils/styles/idea';

export interface IdeaImagePreviewProps {
  path: StorageFile['path'];
}

export const IdeaImagePreview = React.memo<IdeaImagePreviewProps>(
  ({ path }) => {
    const storage = useStorage();

    const ref = React.useMemo(() => storage.ref(path), [path, storage]);

    const url = useStorageDownloadUrl(ref);

    const [imageLoading, setImageLoading] = useBoolean();

    React.useEffect(() => {
      setImageLoading.setTrue();
    }, [path, setImageLoading]);

    const handleImageLoad = React.useCallback(() => {
      setImageLoading.setFalse();
    }, [setImageLoading]);

    return (
      <IdeaPreviewWrapper>
        {imageLoading && (
          <Skeleton variant={'rect'} width={'100%'} height={'100%'} />
        )}
        <Box
          visibility={imageLoading ? 'hidden' : 'visible'}
          display={'flex'}
          justifyContent={'center'}
        >
          <img
            src={url}
            height={ideaListItemHeight}
            alt="Preview"
            onLoad={handleImageLoad}
          />
        </Box>
      </IdeaPreviewWrapper>
    );
  },
);
