import { Box } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { useBoolean } from 'ahooks';
import { IdeaPreviewWrapper } from 'components';
import { StorageFile } from 'models';
import React from 'react';
import { useStorage, useStorageDownloadUrl } from 'services';
import { ideaListItemHeight } from 'styles';

export interface IdeaImagePreviewProps {
  path: StorageFile['path'];
}

export const IdeaImagePreview = React.memo<IdeaImagePreviewProps>(
  ({ path }) => {
    const storage = useStorage();

    const ref = React.useMemo(() => storage.ref(path), [path, storage]);

    const url = useStorageDownloadUrl(ref);

    const [imageLoaded, setImageLoaded] = useBoolean();

    const handleImageLoad = React.useCallback(() => {
      setImageLoaded.setTrue();
    }, [setImageLoaded]);

    return (
      <IdeaPreviewWrapper>
        {!imageLoaded && (
          <Skeleton variant={'rect'} width={'100%'} height={'100%'} />
        )}
        <Box
          visibility={imageLoaded ? 'visible' : 'hidden'}
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
