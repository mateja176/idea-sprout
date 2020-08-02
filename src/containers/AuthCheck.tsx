import { useBoolean } from 'ahooks';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Claims } from 'models';
import React from 'react';
import { AuthCheck as FirebaseAuthCheck } from 'reactfire';

export const AuthCheck: React.FC<
  Omit<
    React.ComponentProps<typeof FirebaseAuthCheck>,
    'auth' | 'requiredClaims'
  > & {
    requiredClaims: Claims;
  }
> = ({ requiredClaims, fallback, children }) => {
  const [claims, setClaims] = React.useState<Claims>({});

  const [loading, setLoading] = useBoolean();

  React.useEffect(() => {
    setLoading.setTrue();

    const unsubscribe = firebase.auth().onIdTokenChanged((user) => {
      if (user) {
        const getTokenResult = () =>
          user.getIdTokenResult().then((result) => {
            setClaims(result.claims);
          });
        getTokenResult()
          .catch(
            () =>
              new Promise((resolve) => {
                setTimeout(() => {
                  getTokenResult().then(resolve);
                }, 2000);
              }),
          )
          .then(setLoading.setFalse);
      }
    });

    return unsubscribe;
  }, [setLoading]);

  const checkPassed = React.useMemo(() => {
    return Object.entries(requiredClaims).every(
      ([key, value]) => claims[key as keyof Claims] === value,
    );
  }, [claims, requiredClaims]);

  return <>{checkPassed && !loading ? children : fallback}</>;
};
