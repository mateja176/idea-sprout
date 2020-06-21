import { IdeaModel } from 'models';
import React from 'react';
import { useStorage, useStorageDownloadURL } from 'reactfire';

export interface VideoProps extends Pick<IdeaModel, 'storyPath'> {}

export const Video: React.FC<VideoProps> = ({ storyPath }) => {
  const storyRef = useStorage().ref(storyPath);

  const storyURL = useStorageDownloadURL(storyRef);

  return (
    <video controls width="100%">
      <source src={storyURL} />
    </video>
  );
};
