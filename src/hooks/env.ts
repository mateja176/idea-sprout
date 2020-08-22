import React from 'react';
import { EnvContext } from '../context/env';
import { Env } from '../models/env';
import { env } from '../services/env';

export const useGetEnv = () => {
  const envContext = React.useContext(EnvContext);

  const getEnvironmentVariable = React.useCallback(
    (key: keyof Env) => {
      const value = env[key];

      return value ?? envContext[key];
    },
    [envContext],
  );

  return getEnvironmentVariable;
};
