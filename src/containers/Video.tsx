import { IdeaModel } from 'models';
import React from 'react';
import { useStorage, useStorageDownloadURL } from 'reactfire';

export interface VideoProps extends Pick<IdeaModel, 'story'> {}

export const Video: React.FC<VideoProps> = ({ story }) => {
  const storyRef = useStorage().ref(story.path);

  const storyURL = useStorageDownloadURL(storyRef);

  return (
    <video controls width="100%">
      <source src={storyURL} />
    </video>
  );
};
