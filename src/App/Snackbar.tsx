import Badge from '@material-ui/core/Badge';
import MaterialSnackbar from '@material-ui/core/Snackbar';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Alert from '@material-ui/lab/Alert';
import { SnackbarContext } from 'context';
import head from 'ramda/es/head';
import React from 'react';
import { useValueWithFallback } from 'services';

export interface SnackbarProps {}

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '50vw',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '90vw',
    },
  },
}));

export const Snackbar: React.FC<SnackbarProps> = () => {
  const { queue, closeSnackbar } = React.useContext(SnackbarContext);

  const classes = useStyles();

  const first = head(queue);

  const firstWithFallback = useValueWithFallback(first, { timeoutMs: 500 });

  React.useEffect(() => {
    if (first) {
      setTimeout(() => {
        closeSnackbar();
      }, first.autoHideDuration);
    }
  }, [first]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <MaterialSnackbar open={!!first}>
      <Badge badgeContent={queue.length} color="primary" classes={classes}>
        <Alert severity={firstWithFallback?.severity} onClose={closeSnackbar}>
          {firstWithFallback?.message}
        </Alert>
      </Badge>
    </MaterialSnackbar>
  );
};
