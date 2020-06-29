import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Router } from 'react-router-dom';
import { FirebaseAppProvider } from 'reactfire';
import { env, history, store } from 'services';

const firebaseConfig = {
  apiKey: env.firebaseApiKey,
  authDomain: env.firebaseAuthDomain,
  databaseUrl: env.firebaseDatabaseUrl,
  projectId: env.firebaseProjectId,
  storageBucket: env.firebaseStorageBucket,
  messagingSenderId: env.firebaseMessagingSenderId,
  appId: env.firebaseAppId,
  measurementId: env.firebaseMeasurementId,
};

export interface ProviderProps {}

export const Provider: React.FC<ProviderProps> = ({ children }) => (
  <ReduxProvider store={store}>
    <Router history={history}>
      <FirebaseAppProvider firebaseConfig={firebaseConfig}>
        {children}
      </FirebaseAppProvider>
    </Router>
  </ReduxProvider>
);
