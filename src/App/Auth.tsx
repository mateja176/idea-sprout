import LogRocket from 'logrocket';
import { initialUser, User } from 'models';
import React from 'react';
import { useUser, useUsersRef } from 'services';
import { DeepNonNullable } from 'utility-types';

export const Auth: React.FC = ({ children }) => {
  const usersRef = useUsersRef();

  const user = useUser({ startWithValue: initialUser });

  React.useEffect(() => {
    if (user && user !== initialUser) {
      const {
        // * user is not a POJO
        uid,
        email,
        displayName,
        photoURL,
        phoneNumber,
        providerId,
      } = user;

      usersRef.doc(user.uid).set({
        uid,
        email,
        displayName,
        photoURL,
        phoneNumber,
        providerId,
      } as User);

      LogRocket.identify(user.uid, { email, displayName } as DeepNonNullable<
        Pick<User, 'email' | 'displayName'>
      >);
    }
  }, [user, usersRef]);

  return <>{children}</>;
};
