import { SnackbarContext } from 'context';
import { ShareButtonProps } from 'models';
import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

export interface CopyUrlProps extends ShareButtonProps {}

export const CopyUrl: React.FC<CopyUrlProps> = ({ url, children }) => {
  const { queueSnackbar } = React.useContext(SnackbarContext);

  const handleCopy: React.ComponentProps<
    typeof CopyToClipboard
  >['onCopy'] = React.useCallback(() => {
    queueSnackbar({
      severity: 'info',
      message: 'Link to idea copied',
    });
  }, [queueSnackbar]);

  return (
    <CopyToClipboard text={url} onCopy={handleCopy}>
      {children}
    </CopyToClipboard>
  );
};
