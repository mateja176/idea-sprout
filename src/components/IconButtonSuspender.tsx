import IconButton from '@material-ui/core/IconButton';
import Radio from '@material-ui/icons/Radio';
import React from 'react';
import { Load } from './Load';

const IconButtonSuspender: React.FC = ({ children }) => {
  return (
    <React.Suspense
      fallback={
        <Load variant={'circle'}>
          <IconButton>
            <Radio />
          </IconButton>
        </Load>
      }
    >
      {children}
    </React.Suspense>
  );
};

export default IconButtonSuspender;
