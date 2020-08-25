import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import React from 'react';
import { Load } from '../../components/Load';
import { tabsTitleSectionHeight } from '../../utils/styles/styles';
import { IdeaSkeleton } from './IdeaSkeleton';
import { IdeasLink } from './IdeasLink';

export interface IdeaContainerSkeletonProps {}

export const IdeaContainerSkeleton: React.FC<IdeaContainerSkeletonProps> = () => {
  return (
    <>
      <Box>
        <Tabs value={false} variant={'fullWidth'}>
          <IdeasLink />
          <Load boxFlex={1}>
            <Tab />
          </Load>
          <Load boxFlex={1}>
            <Tab />
          </Load>
          <Load boxFlex={1}>
            <Tab />
          </Load>
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
