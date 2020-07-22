import { DeepPartial } from 'redux';

export interface Env {
  firebaseApiKey: string;
  firebaseAuthDomain: string;
  firebaseDatabaseUrl: string;
  firebaseProjectId: string;
  firebaseStorageBucket: string;
  firebaseMessagingSenderId: string;
  firebaseAppId: string;
  firebaseMeasurementId: string;
  smtpHost: string;
  smtpUsername: string;
  smtpPassword: string;
  smtpTo: string;
  smtpFrom: string;
  logRocketId?: string;
}

export type RawEnv = DeepPartial<Env>;
