import React from 'react';

export interface IPreloadContext {
  hasWindow: boolean;
  ideaUrl: string;
  logoUrl: string;
  storyUrl: string;
  imageUrls: string[];
}

export const initialPreloadContext: IPreloadContext = {
  hasWindow: true,
  ideaUrl: '',
  logoUrl: '',
  storyUrl: '',
  imageUrls: [],
};

export const PreloadContext = React.createContext(initialPreloadContext);
