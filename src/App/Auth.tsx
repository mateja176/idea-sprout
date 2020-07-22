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
        phoneNumber,
        providerId,
        photoURL,
      } = user;

      usersRef.doc(uid).set({
        email,
        displayName,
        phoneNumber,
        providerId,
        photoURL,
      } as User);

      if (process.env.NODE_ENV === 'production') {
        LogRocket.identify(user.uid, { email, displayName } as DeepNonNullable<
          Pick<User, 'email' | 'displayName'>
        >);
      }
    }
  }, [user, usersRef]);

  return <>{children}</>;
};
