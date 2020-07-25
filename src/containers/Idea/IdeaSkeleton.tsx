import { Box, Chip, Typography } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import { IdeaPreviewWrapper, IdeaSection, Load } from 'components';
import { problemSolutionTitle, rationaleTitle } from 'elements';
import React from 'react';
import { ideaMarginBottom, ideaSectionMl } from 'styles';
import { getInitialIdea } from 'utils';

const idea = getInitialIdea('');

const SectionEditorSkeleton: React.FC<React.ComponentProps<
  typeof IdeaSection
>> = ({ children, ...props }) => (
  <IdeaSection {...props}>
    <>
      {children}
      <Box my={1} visibility={'hidden'}>
        <Chip icon={<Edit />} label={'1 < 10 < 20'} />
      </Box>
    </>
  </IdeaSection>
);

export const IdeaSkeleton: React.FC = () => (
  <Box>
    <IdeaPreviewWrapper ml={ideaSectionMl}>
      <Skeleton variant={'rect'} width={'100%'} height={'100%'} />
    </IdeaPreviewWrapper>
    <SectionEditorSkeleton mb={0}>
      <Load>
        <Typography variant={'h4'}>{idea.name}</Typography>
      </Load>
    </SectionEditorSkeleton>
    <SectionEditorSkeleton mt={0} mb={2}>
      <Load>{idea.tagline}</Load>
    </SectionEditorSkeleton>
    <Skeleton variant="rect" width={'100%'} height={1080} />
    <IdeaSection>
      <Load>{problemSolutionTitle}</Load>
      <Skeleton width={'100%'} />
      <Skeleton width={'100%'} />
      <Skeleton width={'100%'} />
    </IdeaSection>
    <Skeleton variant="rect" width={'100%'} height={1080} />
    <IdeaSection mb={ideaMarginBottom}>
      <Load>{rationaleTitle}</Load>
      <Skeleton width={'100%'} />
      <Skeleton width={'100%'} />
      <Skeleton width={'100%'} />
      <Skeleton width={'100%'} />
    </IdeaSection>
  </Box>
);
