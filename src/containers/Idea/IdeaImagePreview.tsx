import { Skeleton } from '@material-ui/lab';
import { IdeaPreviewWrapper } from 'components';
import { StorageFile } from 'models';
import React from 'react';
import { useStorage, useStorageDownloadUrl } from 'services';
import { Box } from '@material-ui/core';
import { useBoolean } from 'ahooks';

export interface IdeaImagePreviewProps {
  path: StorageFile['path'];
}

export const IdeaImagePreview = React.memo<IdeaImagePreviewProps>(
  ({ path }) => {
    const storage = useStorage();

    const previewPath = React.useMemo(() => {
      const [extension, name, ...parts] = path.split('.').reverse();
      return [
        ...parts.reverse().concat(name.concat('_200x100')),
        extension,
      ].join('.');
    }, [path]);

    const ref = React.useMemo(() => storage.ref(previewPath), [
      previewPath,
      storage,
    ]);

    const url = useStorageDownloadUrl(ref);

    const [imageLoaded, setImageLoaded] = useBoolean();

    const handleImageLoad = React.useCallback(() => {
      setImageLoaded.setTrue();
    }, [setImageLoaded]);

    return (
      <IdeaPreviewWrapper>
        {(!url || !imageLoaded) && (
          <Skeleton variant={'rect'} width={'100%'} height={'100%'} />
        )}
        {url && (
          <Box
            visibility={imageLoaded ? 'visible' : 'hidden'}
            display={'flex'}
            justifyContent={'center'}
          >
            <img src={url} alt="Preview" onLoad={handleImageLoad} />
          </Box>
        )}
      </IdeaPreviewWrapper>
    );
  },
);
