import Box from '@material-ui/core/Box';
import Skeleton from '@material-ui/lab/Skeleton';
import { IdeaPreviewWrapper } from 'components/Idea/IdeaPreviewWrapper';
import { IdeaOptionsWrapper } from 'containers/Idea/Options/IdeaOptionsWrapper';
import React from 'react';
import { textSectionStyle } from 'styles/idea';

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
      shareOption={option}
      rateOption={option}
      reviewOption={option}
      navigateOption={option}
    />
  );
};
