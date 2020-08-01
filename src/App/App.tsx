import React from 'react';
import { hot } from 'react-hot-loader';
import { Auth } from './Auth';
import { Layout } from './Layout';
import { Provider } from './Provider';
import { Routes } from './Routes';
import { Snackbar } from './Snackbar';

export interface AppProps {}

const AuthChildren: React.ComponentProps<typeof Auth>['children'] = ({
  user,
  setUserState,
}) => (
  <Layout user={user}>
    <Routes user={user} setUserState={setUserState} />
    <Snackbar />
  </Layout>
);

const AppComponent: React.FC<AppProps> = () => {
  return (
    <Provider>
      <Auth>{AuthChildren}</Auth>
    </Provider>
  );
};

export const App = hot(module)(AppComponent);
