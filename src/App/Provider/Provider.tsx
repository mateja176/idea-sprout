import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import { init } from 'ramda';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { FirebaseAppProvider } from 'reactfire';
import {
  initialSnackbarContext,
  ISnackbarContext,
  SnackbarContext,
} from '../../context/snackbar';
import { useGetEnv } from '../../hooks/env';
import { hasWindow } from '../../services/services';
import { store } from '../../services/store/store';
import { ThemeProvider } from './ThemeProvider';

export interface ProviderProps {}

export const Provider: React.FC<ProviderProps> = ({ children }) => {
  const preloaded = React.useContext(PreloadContext);

  const getEnv = useGetEnv();

  const firebaseConfig = React.useMemo(
    () => ({
      apiKey: getEnv('firebaseApiKey'),
      authDomain: getEnv('firebaseAuthDomain'),
      databaseUrl: getEnv('firebaseDatabaseUrl'),
      projectId: getEnv('firebaseProjectId'),
      storageBucket: getEnv('firebaseStorageBucket'),
      messagingSenderId: getEnv('firebaseMessagingSenderId'),
      appId: getEnv('firebaseAppId'),
      measurementId: getEnv('firebaseMeasurementId'),
    }),
    [getEnv],
  );

  React.useEffect(() => {
    const logRocketId = getEnv('logRocketId');
    if (process.env.NODE_ENV === 'production' && logRocketId) {
      LogRocket.init(logRocketId);

      setupLogRocketReact(LogRocket);
    }
  }, [getEnv]);

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

  const app = (
    <ReduxProvider store={store}>
      <FirebaseAppProvider firebaseConfig={firebaseConfig}>
        <SnackbarContext.Provider value={snackbarContext}>
          {children}
        </SnackbarContext.Provider>
      </FirebaseAppProvider>
    </ReduxProvider>
  );

  return preloaded.hasWindow ? (
    <BrowserRouter>
      <ThemeProvider>{app}</ThemeProvider>
    </BrowserRouter>
  ) : (
    app
  );
};
