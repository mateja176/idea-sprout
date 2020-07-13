import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { FirebaseAppProvider } from 'reactfire';
import { env, store } from 'services';

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

export const Provider: React.FC<ProviderProps> = ({ children }) => {
  React.useEffect(() => {
    if (env.logRocketId) {
      LogRocket.init(env.logRocketId);

      setupLogRocketReact(LogRocket);
    }
  }, []);

  return (
    <ReduxProvider store={store}>
      <BrowserRouter>
        <FirebaseAppProvider firebaseConfig={firebaseConfig}>
          {children}
        </FirebaseAppProvider>
      </BrowserRouter>
    </ReduxProvider>
  );
};
