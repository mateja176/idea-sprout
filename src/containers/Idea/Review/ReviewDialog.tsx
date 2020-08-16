import Box from '@material-ui/core/Box';
import { DialogProps } from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Theme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { EmptyDraggableDialog } from 'containers/EmptyDraggableDialog';
import { User } from 'models/auth';
import React from 'react';
import { withInlineEllipsis } from 'utils/styles/styles';
import { ReviewForm, ReviewFormProps } from './Form/ReviewForm';
import { ReviewFormSkeleton } from './Form/ReviewFormSkeleton';

export interface ReviewDialogProps
  extends ReviewFormProps,
    Pick<DialogProps, 'open'>,
    Pick<User, 'uid'> {}

export const ReviewDialog = React.memo<ReviewDialogProps>(
  ({ open, ...props }) => {
    const { onClose, idea } = props;

    const xsDown = useMediaQuery((theme: Theme) =>
      theme.breakpoints.down('xs'),
    );

    return (
      <EmptyDraggableDialog
        open={open}
        onClose={onClose}
        fullScreen={xsDown}
        disabled={xsDown}
      >
        <DialogTitle>
          <Box display={'flex'} alignItems={'center'}>
            Review:&nbsp;<i style={withInlineEllipsis}>{idea.name}</i>
          </Box>
        </DialogTitle>
        <React.Suspense fallback={<ReviewFormSkeleton />}>
          <ReviewForm {...props} />
        </React.Suspense>
      </EmptyDraggableDialog>
    );
  },
);
