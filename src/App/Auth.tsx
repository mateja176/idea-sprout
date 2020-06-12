import React from 'react';
import { createAuthStateChange, useActions } from 'services';

export interface AuthProps {}

export const Auth: React.FC<AuthProps> = ({ children }) => {
  const { requestAuthStateChange } = useActions({
    requestAuthStateChange: createAuthStateChange.request,
  });

  React.useEffect(() => {
    requestAuthStateChange();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
};
