import {
  initialSnackbarContext,
  ISnackbarContext,
  SnackbarContext,
} from 'context';
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import { init } from 'ramda';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { FirebaseAppProvider } from 'reactfire';
import { env, store } from 'services';
import { ThemeProvider } from './ThemeProvider';

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
    if (process.env.NODE_ENV === 'production' && env.logRocketId) {
      LogRocket.init(env.logRocketId);

      setupLogRocketReact(LogRocket);
    }
  }, []);

  const [snackbarQueue, setSnackbarQueue] = React.useState(
    initialSnackbarContext.queue,
  );

  const snackbarContext: ISnackbarContext = React.useMemo(
    () => ({
      queue: snackbarQueue,
      queueSnackbar: (snackbar) =>
        setSnackbarQueue((queue) =>
          queue.concat({
            ...snackbar,
            autoHideDuration: snackbar.autoHideDuration ?? 5000,
          }),
        ),
      closeSnackbar: () => setSnackbarQueue((queue) => init(queue)),
    }),
    [snackbarQueue],
  );

  return (
    <BrowserRouter>
      <ReduxProvider store={store}>
        <FirebaseAppProvider firebaseConfig={firebaseConfig}>
          <ThemeProvider>
            <SnackbarContext.Provider value={snackbarContext}>
              {children}
            </SnackbarContext.Provider>
          </ThemeProvider>
        </FirebaseAppProvider>
      </ReduxProvider>
    </BrowserRouter>
  );
};
