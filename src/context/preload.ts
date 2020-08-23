import React from 'react';

export interface IPreloadContext {
  ideaUrl: string;
  logoUrl: string;
}

export const initialPreloadContext: IPreloadContext = {
  ideaUrl: '',
  logoUrl: '',
};

export const PreloadContext = React.createContext(initialPreloadContext);
