import Box, { BoxProps } from '@material-ui/core/Box';
import React from 'react';
import { ideaListItemHeight, logoBorderRadius } from 'styles';

export const IdeaPreviewWrapper = React.memo<BoxProps>(
  ({ children, ...props }) => {
    return (
      <Box
        borderRadius={logoBorderRadius}
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
