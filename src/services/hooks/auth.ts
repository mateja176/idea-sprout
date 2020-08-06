import LogRocket from 'logrocket';
import { User } from 'models';
import React from 'react';
import { useUsersRef } from 'services';
import { DeepNonNullable } from 'utility-types';
import { isFirebaseUser } from 'utils';
import { useUserState } from './firebase';

export const useAuth = () => {
  const user = useUserState();

  const usersRef = useUsersRef();

  React.useEffect(() => {
    if (isFirebaseUser(user)) {
      const {
        // * user is not a POJO
        uid,
        email,
        displayName,
        phoneNumber,
        providerId,
        photoURL,
      } = user;

      usersRef.doc(uid).set(
        {
          email,
          displayName,
          phoneNumber,
          providerId,
          photoURL,
        },
        { merge: true },
      );

      if (process.env.NODE_ENV === 'production') {
        LogRocket.identify(uid, { email, displayName } as DeepNonNullable<
          Pick<User, 'email' | 'displayName'>
        >);

        window.drift?.identify(uid, {
          displayName,
          email,
          phoneNumber,
          providerId,
        });
      }
    }
  }, [user, usersRef]);

  return user;
};
