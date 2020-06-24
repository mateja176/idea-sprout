import { StorageFile } from 'models';
import React from 'react';
import { useStorage, useStorageDownloadURL } from 'reactfire';

export interface VideoProps extends Pick<StorageFile, 'path'> {}

export const Video: React.FC<VideoProps> = ({ path }) => {
  const storyRef = useStorage().ref(path);

  const storyURL = useStorageDownloadURL(storyRef);

  return (
    <video controls width={'100%'}>
      <source src={storyURL} />
    </video>
  );
};
