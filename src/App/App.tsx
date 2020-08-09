import React from 'react';
import { hot } from 'react-hot-loader';
import { Layout } from './Layout';
import { Provider } from './Provider';
import { Routes } from './Routes/Routes';
import { RoutesSkeleton } from './Routes/RoutesSkeleton';
import { Snackbar } from './Snackbar';

export interface AppProps {}

const AppComponent: React.FC<AppProps> = () => {
  return (
    <Provider>
      <Layout>
        <React.Suspense fallback={<RoutesSkeleton />}>
          <Routes />
        </React.Suspense>
        <Snackbar />
      </Layout>
    </Provider>
  );
};

export const App = hot(module)(AppComponent);
