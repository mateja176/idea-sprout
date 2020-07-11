import { DialogProps } from '@material-ui/core';
import { DraggableDialog } from 'containers';
import 'firebase/firestore';
import { User } from 'models';
import React from 'react';
import { useValueWithFallback } from 'services';
import { withEllipsis } from 'styles';
import { ReviewForm, ReviewFormProps } from './ReviewForm';
import { ReviewFormSkeleton } from './ReviewFormSkeleton';

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
    const openWithFallback = useValueWithFallback(open, { timeoutMs: 500 });

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
