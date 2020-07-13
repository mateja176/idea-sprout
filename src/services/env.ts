import { Env, RawEnv } from 'models';
import { assertRequired } from './services';

const rawEnv: RawEnv = {
  firebaseApiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  firebaseAuthDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  firebaseDatabaseUrl: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  firebaseProjectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  firebaseStorageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  firebaseMessagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  firebaseAppId: process.env.REACT_APP_FIREBASE_APP_ID,
  firebaseMeasurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

assertRequired(rawEnv);
export const env: Env = {
  ...rawEnv,
  logRocketId: process.env.REACT_APP_LOG_ROCKET_ID,
};
