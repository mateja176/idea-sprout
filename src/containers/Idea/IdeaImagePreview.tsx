import { IdeaImagePreview } from 'components';
import { StorageFile } from 'models';
import React from 'react';
import { useStorage, useStorageDownloadUrl } from 'services';

export interface IdeaImagePreviewProps {
  path: StorageFile['path'];
}

export const IdeaImagePreviewContainer: React.FC<IdeaImagePreviewProps> = ({
  path,
}) => {
  const ref = useStorage().ref(path);
  const url = useStorageDownloadUrl(ref);

  return <IdeaImagePreview url={url} />;
};
