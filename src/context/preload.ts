import React from 'react';
import { IdeaModel } from '../models/idea';

export interface IPreloadContext {
  hasWindow: boolean;
  ideaUrl: string;
  logoUrl: string;
  storyUrl: string;
  imageUrls: string[];
  idea?: IdeaModel;
}

export const initialPreloadContext: IPreloadContext = {
  hasWindow: true,
  ideaUrl: '',
  logoUrl: '',
  storyUrl: '',
  imageUrls: [],
};

export const PreloadContext = React.createContext(initialPreloadContext);
