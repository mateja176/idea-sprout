import Box from '@material-ui/core/Box';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import makeStyles from '@material-ui/core/styles/makeStyles';
import DragIndicator from '@material-ui/icons/DragIndicator';
import React from 'react';
import { modalMaxWidth } from '../utils/styles/styles';
import { EmptyDraggableDialog } from './EmptyDraggableDialog';

export interface DraggableDialogProps
  extends React.ComponentProps<typeof EmptyDraggableDialog> {
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

    return (
      <EmptyDraggableDialog {...props} disabled={disabled}>
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
      </EmptyDraggableDialog>
    );
  },
);
