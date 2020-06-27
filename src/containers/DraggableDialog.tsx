import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  makeStyles,
} from '@material-ui/core';
import { DragIndicator } from '@material-ui/icons';
import { DraggablePaper } from 'components';
import React from 'react';

type WithMinWidth = Pick<React.CSSProperties, 'minWidth'>;

export interface DraggableDialogProps extends DialogProps, WithMinWidth {
  dialogTitle: React.ReactNode;
  actions?: React.ReactNode;
}

const dragHandleId = 'drag-handle';

const useStyles = makeStyles(() => ({
  paper: ({ minWidth }: WithMinWidth) => ({ minWidth }),
}));

export const DraggableDialog: React.FC<DraggableDialogProps> = ({
  dialogTitle,
  children,
  actions,
  minWidth,
  ...props
}) => {
  const classes = useStyles({ minWidth });

  const { scroll } = props;

  return (
    <Dialog // TODO replace modal with custom implementation since elements outside of the dialog cannot be interacted with
      {...props}
      hideBackdrop
      PaperComponent={DraggablePaper}
      classes={{
        paper: classes.paper,
      }}
    >
      <DialogTitle style={{ cursor: 'grab' }}>
        <Box display="flex" alignItems="center">
          {dialogTitle}
          <Box ml="auto" id={dragHandleId}>
            <DragIndicator color="action" />
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent dividers={scroll === 'paper'}>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};
