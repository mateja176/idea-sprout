import { useBoolean } from 'ahooks';
import LogRocket from 'logrocket';
import { User, UserState, WithUserState } from 'models';
import React from 'react';
import { useUser, useUsersRef } from 'services';
import { DeepNonNullable } from 'utility-types';
import { isFirebaseUser } from 'utils';

export const Auth = ({
  children,
}: {
  children: (
    props: WithUserState & { userState: boolean; setUserState: () => void },
  ) => React.ReactNode;
}) => {
  const usersRef = useUsersRef();
  const user = useUser<UserState>({
    startWithValue: 'loading',
  });
  const [userState, setUserState] = useBoolean();

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
        } as User,
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

  const authChildren = React.useMemo(
    () => children({ user, userState, setUserState: setUserState.toggle }),
    [user, children, userState, setUserState],
  );

  return <>{authChildren}</>;
};
