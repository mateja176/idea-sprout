import { DialogProps } from '@material-ui/core';
import { DraggableDialog } from 'containers';
import 'firebase/firestore';
import { User } from 'models';
import React from 'react';
import { useBooleanWithFallback } from 'services';
import { withEllipsis } from 'styles';
import { ReviewForm, ReviewFormProps, ReviewFormSkeleton } from './Form';

export interface ReviewDialogProps
  extends ReviewFormProps,
    Pick<DialogProps, 'open'>,
    Pick<User, 'uid'> {}

export const ReviewDialog = React.memo<ReviewDialogProps>(
  ({ open, ...props }) => {
    const {
      idea: { name },
      onClose,
    } = props;
    const openWithFallback = useBooleanWithFallback(open, { timeoutMs: 500 });

    const handleClose = React.useCallback(() => {
      onClose();
    }, [onClose]);

    return (
      <DraggableDialog
        open={open}
        onClose={handleClose}
        dialogTitle={
          <>
            Review:&nbsp;<i style={withEllipsis}>{name}</i>
          </>
        }
      >
        {openWithFallback && (
          <React.Suspense fallback={<ReviewFormSkeleton />}>
            <ReviewForm {...props} />
          </React.Suspense>
        )}
      </DraggableDialog>
    );
  },
);
