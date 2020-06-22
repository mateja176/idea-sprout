import { StorageFile } from 'models';
import React from 'react';
import { useStorage, useStorageDownloadURL } from 'reactfire';

export interface VideoProps extends StorageFile {}

export const Video: React.FC<VideoProps> = ({ path, ...dimensions }) => {
  const storyRef = useStorage().ref(path);

  const storyURL = useStorageDownloadURL(storyRef);

  return (
    <video controls {...dimensions}>
      <source src={storyURL} />
    </video>
  );
};
