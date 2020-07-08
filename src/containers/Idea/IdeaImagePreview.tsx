import { Skeleton } from '@material-ui/lab';
import { IdeaPreviewWrapper } from 'components';
import { StorageFile } from 'models';
import React from 'react';
import { useStorage, useStorageDownloadUrl } from 'services';

export interface IdeaImagePreviewProps {
  path: StorageFile['path'];
}

export const IdeaImagePreview = React.memo<IdeaImagePreviewProps>(
  ({ path }) => {
    const [extension, name, ...parts] = path.split('.').reverse();
    const previewPath = [
      ...parts.reverse().concat(name.concat('_200x100')),
      extension,
    ].join('.');
    const ref = useStorage().ref(previewPath);
    const url = useStorageDownloadUrl(ref);

    return (
      <IdeaPreviewWrapper url={url}>
        <Skeleton variant={'rect'} width={'100%'} height={'100%'} />
      </IdeaPreviewWrapper>
    );
  },
);
