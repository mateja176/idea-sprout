import { Box } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { IdeaOptionsWrapper, IdeaPreviewWrapper } from 'components';
import React from 'react';
import { textSectionStyle } from 'styles';

const option = <Skeleton variant={'rect'} width={'100%'} height={'100%'} />;

export const IdeaOptionsSkeleton: React.FC = () => {
  return (
    <IdeaOptionsWrapper
      imagePreview={
        <IdeaPreviewWrapper>
          <Skeleton variant={'rect'} width={'100%'} height={'100%'} />
        </IdeaPreviewWrapper>
      }
      textSection={
        <Box mr={1} style={textSectionStyle}>
          <Skeleton height={'2em'} />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </Box>
      }
      options={{
        share: option,
        rate: option,
        review: option,
        navigate: option,
      }}
    />
  );
};
