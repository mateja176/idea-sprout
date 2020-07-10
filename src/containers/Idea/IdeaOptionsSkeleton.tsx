import { Box } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { IdeaOptionsWrapper, IdeaPreviewWrapper } from 'components';
import React from 'react';
import { useIdeaOptionsButtonBorder } from 'services';
import { textSectionStyle } from 'styles';

export const IdeaOptionsSkeleton: React.FC = () => {
  const buttonBorder = useIdeaOptionsButtonBorder();

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
      options={
        <IdeaPreviewWrapper>
          <Box
            width={'100%'}
            height={'100%'}
            border={buttonBorder}
            borderRadius={5}
          >
            <Box
              display="flex"
              width={'100%'}
              height={'50%'}
              borderBottom={buttonBorder}
            >
              <Box width={'50%'} height={'100%'} borderRight={buttonBorder}>
                <Skeleton variant={'rect'} width={'100%'} height={'100%'} />
              </Box>
              <Box width={'50%'} height={'100%'}>
                <Skeleton variant={'rect'} width={'100%'} height={'100%'} />
              </Box>
            </Box>
            <Box display="flex" width={'100%'} height={'50%'}>
              <Box width={'50%'} height={'100%'} borderRight={buttonBorder}>
                <Skeleton variant={'rect'} width={'100%'} height={'100%'} />
              </Box>
              <Box width={'50%'} height={'100%'}>
                <Skeleton variant={'rect'} width={'100%'} height={'100%'} />
              </Box>
            </Box>
          </Box>
        </IdeaPreviewWrapper>
      }
    />
  );
};
