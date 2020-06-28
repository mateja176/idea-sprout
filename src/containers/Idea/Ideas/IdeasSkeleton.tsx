import { Hidden, Icon, List } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { range } from 'ramda';
import React from 'react';
import { ideaListStyle } from 'styles';
import { IdeaOptionsSkeleton } from '../IdeaOptionsSkeleton';

export interface IdeasSkeletonProps {}

export const IdeasSkeleton: React.FC<IdeasSkeletonProps> = () => {
  return (
    <List style={ideaListStyle}>
      {range(0, 10).map((i) => (
        <IdeaOptionsSkeleton
          key={i}
          secondaryActionIcon={
            <Hidden xsDown>
              <Icon>
                <Skeleton variant={'rect'} width={'100%'} height={'100%'} />
              </Icon>
            </Hidden>
          }
        />
      ))}
    </List>
  );
};
