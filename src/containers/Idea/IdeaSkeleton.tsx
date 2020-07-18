import { Box, Chip, Typography } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import { IdeaPreviewWrapper, IdeaSection, Load } from 'components';
import { problemSolutionTitle, rationaleTitle } from 'elements';
import React from 'react';
import { ideaMarginBottom, logoMr, nameAndLogoMt } from 'styles';
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
    <Box mt={nameAndLogoMt} display={'flex'}>
      <Box flex={1} mr={1}>
        <SectionEditorSkeleton>
          <Typography variant={'h4'}>{idea.name}</Typography>
        </SectionEditorSkeleton>
      </Box>
      <IdeaPreviewWrapper mr={logoMr}>
        <Skeleton variant={'rect'} width={'100%'} height={'100%'} />
      </IdeaPreviewWrapper>
    </Box>
    <SectionEditorSkeleton mt={0}>
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
