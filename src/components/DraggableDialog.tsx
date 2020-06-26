import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogProps,
  DialogActions,
} from '@material-ui/core';
import { DragIndicator } from '@material-ui/icons';
import React from 'react';
import { DraggablePaper } from './DraggablePaper';

export interface DraggableDialogProps extends DialogProps {
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