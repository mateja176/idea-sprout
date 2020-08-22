import { createContext } from 'react';
import { RawEnv } from '../models/env';

export const initialEnvContext: RawEnv = {};

export const EnvContext = createContext(initialEnvContext);
