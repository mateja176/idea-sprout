import React from 'react';
import { useStorage, useStorageDownloadURL } from 'reactfire';
import { StorageFile } from '../../models/idea';

export interface VideoProps extends Pick<StorageFile, 'path'> {}

export const Video: React.FC<VideoProps> = ({ path }) => {
  const storyRef = useStorage().ref(path);

  const storyURL = useStorageDownloadURL(storyRef);

  return <video controls width={'100%'} src={storyURL} />;
};
