import Button from '@material-ui/core/Button';
import CloudUpload from '@material-ui/icons/CloudUpload';
import React from 'react';
import { UploadButton } from './UploadButton';

export const UploadButtonSuspender: React.FC<React.ComponentProps<
  typeof UploadButton
>> = (props) => {
  const { label, style } = props;

  return (
    <React.Suspense
      fallback={
        label ? (
          <Button style={style} startIcon={<CloudUpload />}>
            {label}
          </Button>
        ) : (
          <Button style={style} startIcon={<CloudUpload />} />
        )
      }
    >
      <UploadButton {...props} />
    </React.Suspense>
  );
};
