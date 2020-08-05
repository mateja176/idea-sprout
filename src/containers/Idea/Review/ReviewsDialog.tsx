import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { DraggableDialog } from 'containers';
import { IdeaModel, Rating } from 'models';
import range from 'ramda/es/range';
import React from 'react';
import { useBooleanWithFallback } from 'services';
import { withEllipsis } from 'styles';
import { Reviews } from './Reviews';
import { ReviewSkeleton } from './ReviewSkeleton';

export interface ReviewsProps
  extends Pick<IdeaModel, 'id' | 'name'>,
    Pick<Rating, 'count'> {
  open: boolean;
  onClose: () => void;
}

export const ReviewsDialog = React.memo<ReviewsProps>(
  ({ id, name, count, open, onClose }) => {
    const openWithFallback = useBooleanWithFallback(open, { timeoutMs: 500 });

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
              fallback={range(0, count).map((i) => (
                <ReviewSkeleton key={i} />
              ))}
            >
              <Reviews id={id} />
            </React.Suspense>
          )
        )}
      </DraggableDialog>
    );
  },
);
