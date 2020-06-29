import { List } from '@material-ui/core';
import { CollapseIconSkeleton } from 'components';
import { range } from 'ramda';
import React from 'react';
import { ideaListStyle } from 'styles';
import { ideasFetchLimit } from 'utils';
import { IdeaOptionsSkeleton } from '../IdeaOptionsSkeleton';

export interface IdeasSkeletonProps {}

export const IdeasSkeleton: React.FC<IdeasSkeletonProps> = () => {
  return (
    <List style={ideaListStyle}>
      {range(0, ideasFetchLimit).map((i) => (
        <IdeaOptionsSkeleton
          key={i}
          secondaryActionIcon={<CollapseIconSkeleton />}
        />
      ))}
    </List>
  );
};
