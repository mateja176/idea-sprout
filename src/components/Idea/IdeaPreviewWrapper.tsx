import { Box, BoxProps } from '@material-ui/core';
import React from 'react';
import { ideaListItemHeight } from 'styles';

export const IdeaPreviewWrapper = React.memo<BoxProps>(
  ({ children, ...props }) => {
    return (
      <Box
        borderRadius={5}
        minWidth={ideaListItemHeight}
        maxWidth={ideaListItemHeight} // * possible allow wider images in the future
        height={ideaListItemHeight}
        overflow={'hidden'}
        {...props}
      >
        {children}
      </Box>
    );
  },
);
