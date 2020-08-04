import { SnackbarContext } from 'context';
import React from 'react';
import { useAuth } from 'services';
import { Layout } from './Layout';
import { Routes } from './Routes';
import { Snackbar } from './Snackbar';

export const Auth: React.FC = () => {
  const user = useAuth();

  React.useContext(SnackbarContext); // * user.reload() does not trigger a re-render

  return (
    // * Layout and Routes are not re-rendered even when Auth is if no props are passed down
    <Layout user={user}>
      <Routes user={user} />
      <Snackbar />
    </Layout>
  );
};
