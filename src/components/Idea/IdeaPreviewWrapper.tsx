import { Box } from '@material-ui/core';
import React from 'react';
import { ideaListItemHeight } from 'styles';

export const IdeaPreviewWrapper = React.memo<{
  url?: string;
  children?: React.ReactNode;
}>(({ url, children }) => {
  const style = React.useMemo(
    () => ({
      backgroundImage: url ? `url(${url})` : 'none',
      backgroundPosition: 'center center',
      backgroundSize: 'cover',
      overflow: 'hidden',
      minWidth: ideaListItemHeight,
    }),
    [url],
  );
  return (
    <Box borderRadius={5} height={ideaListItemHeight} style={style}>
      {!url && children}
    </Box>
  );
});
