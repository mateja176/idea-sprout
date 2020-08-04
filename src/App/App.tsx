import React from 'react';
import { hot } from 'react-hot-loader';
import { Auth } from './Auth';
import { Provider } from './Provider';

export interface AppProps {}

const AppComponent: React.FC<AppProps> = () => {
  return (
    <Provider>
      <Auth />
    </Provider>
  );
};

export const App = hot(module)(AppComponent);
