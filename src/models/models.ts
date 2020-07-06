import { SnackbarProps } from '@material-ui/core';
import { AlertProps } from '@material-ui/lab';
import { FacebookIcon, FacebookShareButton } from 'react-share';

export interface WithId {
  id: string;
}

export interface WithAuthor {
  author: string;
}

export interface WithCount {
  count: number;
}

export interface ISnackbar
  extends Pick<SnackbarProps, 'message' | 'autoHideDuration'>,
    Required<Pick<AlertProps, 'severity'>> {
  message: string;
}

export interface WithTimeout {
  timeoutMs: number;
}

export interface ShareButtonProps
  extends React.ComponentProps<typeof FacebookShareButton> {}

export interface ShareIconProps
  extends React.ComponentProps<typeof FacebookIcon> {}
