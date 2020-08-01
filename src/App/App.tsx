import React from 'react';
import { hot } from 'react-hot-loader';
import { Auth } from './Auth';
import { Layout } from './Layout';
import { Provider } from './Provider';
import { Routes } from './Routes';
import { Snackbar } from './Snackbar';

export interface AppProps {}

const LayoutChildren: React.ComponentProps<typeof Layout>['children'] = (
  props,
) => <Routes {...props} />;

const AppComponent: React.FC<AppProps> = () => {
  return (
    <Provider>
      <Auth>
        <Layout>{LayoutChildren}</Layout>
        <Snackbar />
      </Auth>
    </Provider>
  );
};

export const App = hot(module)(AppComponent);
