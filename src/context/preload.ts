import React from 'react';

export interface IPreloadContext {
  ideaUrl: string;
  logoUrl: string;
  storyUrl: string;
  imageUrls: string[];
}

export const initialPreloadContext: IPreloadContext = {
  ideaUrl: '',
  logoUrl: '',
  storyUrl: '',
  imageUrls: [],
};

export const PreloadContext = React.createContext(initialPreloadContext);
