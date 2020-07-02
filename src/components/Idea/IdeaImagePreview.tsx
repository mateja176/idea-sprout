import { Box } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React from 'react';
import { ideaListItemHeight } from 'styles';

export const IdeaImagePreview: React.FC<{ url?: string }> = ({ url }) => {
  return (
    <Box
      borderRadius={5}
      width={ideaListItemHeight}
      height={ideaListItemHeight}
      style={{
        backgroundImage: url ? `url(${url})` : 'none',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        overflow: 'hidden',
      }}
    >
      {!url && <Skeleton variant={'rect'} width={'100%'} height={'100%'} />}
    </Box>
  );
};
