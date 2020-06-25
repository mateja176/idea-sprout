import { SnackbarProps } from '@material-ui/core';
import { AlertProps } from '@material-ui/lab';
import { FacebookShareButton } from 'react-share';

export type AsyncState<State> = 'initial' | 'loading' | Error | State;

export interface ISnackbar
  extends Pick<SnackbarProps, 'message' | 'autoHideDuration'>,
    Pick<AlertProps, 'severity'> {
  message: string;
}

export interface WithTimeout {
  timeoutMs: number;
}

export interface ShareButtonProps
  extends Pick<
    React.ComponentProps<typeof FacebookShareButton>,
    'url' | 'onShareWindowClose'
  > {
  children: React.ReactNode;
}

export interface ShareIconProps {
  size: number;
}
