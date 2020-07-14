import { Box } from '@material-ui/core';
import React from 'react';
import { ideaListItemHeight } from 'styles';

export const IdeaPreviewWrapper = React.memo<{
  children?: React.ReactNode;
}>(({ children }) => {
  return (
    <Box
      borderRadius={5}
      minWidth={ideaListItemHeight}
      maxWidth={ideaListItemHeight} // * possible allow wider images in the future
      height={ideaListItemHeight}
      overflow={'hidden'}
    >
      {children}
    </Box>
  );
});
