import { Skeleton } from '@material-ui/lab';
import { IdeaPreviewWrapper } from 'components';
import { StorageFile } from 'models';
import React from 'react';
import { useStorage, useStorageDownloadUrl } from 'services';

export interface IdeaImagePreviewProps {
  path: StorageFile['path'];
}

export const IdeaImagePreview: React.FC<IdeaImagePreviewProps> = ({ path }) => {
  const ref = useStorage().ref(path);
  const url = useStorageDownloadUrl(ref);

  return (
    <IdeaPreviewWrapper url={url}>
      <Skeleton variant={'rect'} width={'100%'} height={'100%'} />
    </IdeaPreviewWrapper>
  );
};
