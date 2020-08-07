import Box from '@material-ui/core/Box';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { PaperProps } from '@material-ui/core/Paper';
import makeStyles from '@material-ui/core/styles/makeStyles';
import DragIndicator from '@material-ui/icons/DragIndicator';
import { DraggablePaper } from 'components';
import React from 'react';
import { modalMaxWidth } from 'styles';

export interface DraggableDialogProps extends DialogProps {
  disabled: boolean;
  dialogTitle: React.ReactNode;
  actions?: React.ReactNode;
}

const dragHandleId = 'drag-handle';

const titleStyle: React.CSSProperties = { cursor: 'grab' };

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up('md')]: {
      minWidth: modalMaxWidth,
    },
  },
}));

export const DraggableDialog = React.memo<DraggableDialogProps>(
  ({ disabled, dialogTitle, children, actions, ...props }) => {
    const classes = useStyles();

    const root = React.useMemo(
      () => ({
        root: classes.root,
      }),
      [classes],
    );

    const { scroll } = props;

    const Draggable = React.useCallback(
      (props: PaperProps) => <DraggablePaper {...props} disabled={disabled} />,
      [disabled],
    );

    return (
      <Dialog // TODO replace modal with custom implementation since elements outside of the dialog cannot be interacted with
        {...props}
        hideBackdrop
        PaperComponent={Draggable}
      >
        <DialogTitle style={titleStyle}>
          <Box display="flex" alignItems="center">
            {dialogTitle}
            {!disabled && (
              <Box ml="auto" id={dragHandleId}>
                <DragIndicator color="action" />
              </Box>
            )}
          </Box>
        </DialogTitle>
        <DialogContent classes={root} dividers={scroll === 'paper'}>
          {children}
        </DialogContent>
        {actions && <DialogActions>{actions}</DialogActions>}
      </Dialog>
    );
  },
);
