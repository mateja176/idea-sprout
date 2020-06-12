import { useSelector } from 'react-redux';
import { selectIsSignedIn } from 'services/store';

export const useIsSignedIn = () => {
  const isSignedIn = useSelector(selectIsSignedIn);

  return isSignedIn;
};
