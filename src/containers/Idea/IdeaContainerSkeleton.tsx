import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { Load } from 'components/Load';
import React from 'react';
import { tabsTitleSectionHeight } from 'utils/styles/styles';
import { BackToIdeas } from './BackToIdeas';
import { IdeaSkeleton } from './IdeaSkeleton';

export interface IdeaContainerSkeletonProps {}

export const IdeaContainerSkeleton: React.FC<IdeaContainerSkeletonProps> = () => {
  return (
    <>
      <Box>
        <Tabs value={false}>
          <BackToIdeas />
          <Load boxFlex={1}>
            <Tab />
          </Load>
        </Tabs>
        <Box height={tabsTitleSectionHeight} />
      </Box>
      <Box flex={1} display={'flex'} flexDirection={'column'} overflow={'auto'}>
        <IdeaSkeleton />
      </Box>
    </>
  );
};
