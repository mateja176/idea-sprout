import { useBoolean } from 'ahooks';
import firebase from 'firebase/app';
import { Claims } from 'models/firebase';
import React from 'react';
import { AuthCheck as FirebaseAuthCheck, useAuth } from 'reactfire';

export const AuthCheck: React.FC<
  Omit<
    React.ComponentProps<typeof FirebaseAuthCheck>,
    'auth' | 'requiredClaims'
  > & {
    requiredClaims: Claims;
  }
> = ({ requiredClaims, fallback, children }) => {
  const auth = useAuth();

  const [claims, setClaims] = React.useState<Claims>({});

  const [loading, setLoading] = useBoolean();

  React.useEffect(() => {
    setLoading.setTrue();

    const unsubscribe = auth.onIdTokenChanged((user) => {
      if (user) {
        const getTokenResult = () =>
          user.getIdTokenResult().catch(
            () =>
              new Promise<firebase.auth.IdTokenResult>((resolve) => {
                setTimeout(() => {
                  getTokenResult().then(resolve);
                }, 2000);
              }),
          );
        getTokenResult().then((result) => {
          setClaims(result.claims);
          setLoading.setFalse();
        });
      }
    });

    return unsubscribe;
  }, [setLoading, auth]);

  const checkPassed = React.useMemo(() => {
    return Object.entries(requiredClaims).every(
      ([key, value]) => claims[key as keyof Claims] === value,
    );
  }, [claims, requiredClaims]);

  return <>{checkPassed && !loading ? children : fallback}</>;
};
