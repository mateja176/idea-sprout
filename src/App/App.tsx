import React from 'react';
import { hot } from 'react-hot-loader';
import { Auth } from './Auth';
import { Layout } from './Layout';
import { Provider } from './Provider';
import { Routes } from './Routes';
import { Snackbar } from './Snackbar';

export interface AppProps {}

const AppComponent: React.FC<AppProps> = () => {
  return (
    <Provider>
      <Layout>
        <Auth>
          <Routes />
          <Snackbar />
        </Auth>
      </Layout>
    </Provider>
  );
};

export const App = hot(module)(AppComponent);
