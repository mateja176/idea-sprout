import Radio from '@material-ui/core/Radio';
import React from 'react';
import { Load } from './Load';

const IconSuspender: React.FC = ({ children }) => {
  return (
    <React.Suspense
      fallback={
        <Load>
          <Radio />
        </Load>
      }
    >
      {children}
    </React.Suspense>
  );
};

export default IconSuspender;
