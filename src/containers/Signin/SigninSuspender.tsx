import { SigninDivider } from 'components/SigninDivider';
import React from 'react';
import Signin from './Signin';

const SigninSuspender: typeof Signin = (props) => {
  return (
    <React.Suspense fallback={SigninDivider}>
      <Signin {...props} />
    </React.Suspense>
  );
};

export default SigninSuspender;
