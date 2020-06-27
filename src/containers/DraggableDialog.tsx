import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
} from '@material-ui/core';
import { DragIndicator } from '@material-ui/icons';
import { DraggablePaper } from 'components';
import React from 'react';

interface WithMinWidth {}

export interface DraggableDialogProps extends DialogProps, WithMinWidth {
  dialogTitle: React.ReactNode;
  actions?: React.ReactNode;
}

const dragHandleId = 'drag-handle';

export const DraggableDialog: React.FC<DraggableDialogProps> = ({
  dialogTitle,
  children,
  actions,
  ...props
}) => {
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
      <DialogContent dividers={scroll === 'paper'}>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};
