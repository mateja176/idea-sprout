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

export interface DraggableDialogProps extends DialogProps {
  dialogTitle: React.ReactNode;
  actions?: React.ReactNode;
}

const dragHandleId = 'drag-handle';

const useStyles = makeStyles(() => ({ root: { minWidth: 600 } }));

export const DraggableDialog: React.FC<DraggableDialogProps> = ({
  dialogTitle,
  children,
  actions,
  ...props
}) => {
  const classes = useStyles();

  const { scroll } = props;

  return (
    <Dialog // TODO replace modal with custom implementation since elements outside of the dialog cannot be interacted with
      {...props}
      hideBackdrop
      PaperComponent={DraggablePaper}
    >
      <DialogTitle style={{ cursor: 'grab' }}>
        <Box display="flex" alignItems="center">
          {dialogTitle}
          <Box ml="auto" id={dragHandleId}>
            <DragIndicator color="action" />
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent
        dividers={scroll === 'paper'}
        classes={{
          root: classes.root,
        }}
      >
        {children}
      </DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};
