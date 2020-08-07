import { DialogProps } from '@material-ui/core/Dialog';
import { Theme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { DraggableDialog } from 'containers';
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

    const xsDown = useMediaQuery((theme: Theme) =>
      theme.breakpoints.down('xs'),
    );

    return (
      <DraggableDialog
        open={open}
        onClose={handleClose}
        dialogTitle={
          <>
            Review:&nbsp;<i style={withEllipsis}>{name}</i>
          </>
        }
        fullScreen={xsDown}
        disabled={xsDown}
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
