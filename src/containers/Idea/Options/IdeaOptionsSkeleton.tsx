import Box from '@material-ui/core/Box';
import Skeleton from '@material-ui/lab/Skeleton';
import React from 'react';
import { IdeaPreviewWrapper } from '../../../components/Idea/IdeaPreviewWrapper';
import { textSectionStyle } from '../../../utils/styles/idea';
import { IdeaOptionsWrapper } from '../../Idea/Options/IdeaOptionsWrapper';

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
