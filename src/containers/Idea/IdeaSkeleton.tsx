import { Box, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { IdeaPreviewWrapper, IdeaSection, Load } from 'components';
import { problemSolutionTitle, rationaleTitle } from 'elements';
import React from 'react';
import { logoMr } from 'styles';
import { getInitialIdea } from 'utils';

export interface IdeaSkeletonProps {}

const idea = getInitialIdea('');

export const IdeaSkeleton: React.FC<IdeaSkeletonProps> = () => (
  <Box>
    <Box display={'flex'}>
      <Box flex={1} mr={1}>
        <IdeaSection>
          <Load>
            <Typography variant={'h4'}>{idea.name}</Typography>
          </Load>
        </IdeaSection>
      </Box>
      <IdeaPreviewWrapper mr={logoMr}>
        <Skeleton variant={'rect'} width={'100%'} height={'100%'} />
      </IdeaPreviewWrapper>
    </Box>
    <IdeaSection mt={0}>
      <Load>{idea.tagline}</Load>
    </IdeaSection>
    <Skeleton variant="rect" width={'100%'} height={720} />
    <IdeaSection>
      <Load>{problemSolutionTitle}</Load>
      <Skeleton width={'100%'} />
      <Skeleton width={'100%'} />
      <Skeleton width={'100%'} />
    </IdeaSection>
    <Skeleton variant="rect" width={'100%'} height={720} />
    <IdeaSection>
      <Load>{rationaleTitle}</Load>
      <Skeleton width={'100%'} />
      <Skeleton width={'100%'} />
      <Skeleton width={'100%'} />
      <Skeleton width={'100%'} />
    </IdeaSection>
  </Box>
);
