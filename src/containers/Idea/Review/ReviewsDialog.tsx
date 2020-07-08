import { Box, Button, Typography } from '@material-ui/core';
import { DraggableDialog } from 'containers';
import { IdeaModel } from 'models';
import { range } from 'ramda';
import React from 'react';
import { useValueWithFallback } from 'services';
import { withEllipsis } from 'styles';
import { Reviews } from './Reviews';
import { ReviewSkeleton } from './ReviewSkeleton';

export interface ReviewsProps
  extends Pick<IdeaModel, 'id' | 'name'>,
    Pick<IdeaModel['rating'], 'count'> {
  open: boolean;
  onClose: () => void;
}

export const ReviewsDialog: React.FC<ReviewsProps> = ({
  id,
  name,
  count,
  open,
  onClose,
}) => {
  const openWithFallback = useValueWithFallback(open, { timeoutMs: 500 });

  return (
    <DraggableDialog
      open={open}
      onClose={onClose}
      scroll="paper"
      dialogTitle={
        <>
          Reviews:&nbsp;<i style={withEllipsis}>{name}</i>
        </>
      }
      actions={<Button onClick={onClose}>Close</Button>}
    >
      {count <= 0 ? (
        <>
          <Typography>No reviews yet.</Typography>
          <Box visibility={'hidden'}>
            <ReviewSkeleton />
          </Box>
        </>
      ) : (
        openWithFallback && (
          <React.Suspense
            fallback={range(0, count).map(() => (
              <ReviewSkeleton />
            ))}
          >
            <Reviews id={id} />
          </React.Suspense>
        )
      )}
    </DraggableDialog>
  );
};
