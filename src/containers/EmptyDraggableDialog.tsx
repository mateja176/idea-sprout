import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import { PaperProps } from '@material-ui/core/Paper';
import { DraggablePaper } from 'components/DraggablePaper';
import React from 'react';

export const EmptyDraggableDialog = React.memo<
  DialogProps & { disabled: boolean }
>(({ disabled, children, ...props }) => {
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
      {children}
    </Dialog>
  );
});
