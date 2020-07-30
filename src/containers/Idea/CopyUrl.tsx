import { ShareButtonProps } from 'models';
import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { createQueueSnackbar, useActions } from 'services';

export interface CopyUrlProps extends ShareButtonProps {}

const actionCreators = { queueSnackbar: createQueueSnackbar };

export const CopyUrl: React.FC<CopyUrlProps> = ({ url, children }) => {
  const { queueSnackbar } = useActions(actionCreators);

  return (
    <CopyToClipboard
      text={url}
      onCopy={() => {
        queueSnackbar({
          severity: 'info',
          message: 'Link to idea copied',
        });
      }}
    >
      {children}
    </CopyToClipboard>
  );
};
