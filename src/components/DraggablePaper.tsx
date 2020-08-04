import Paper, { PaperProps } from '@material-ui/core/Paper';
import React from 'react';
import Draggable from 'react-draggable';

export const DraggablePaper: React.FC<PaperProps> = (props) => {
  return (
    <Draggable
      handle=".MuiDialogTitle-root"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
};
