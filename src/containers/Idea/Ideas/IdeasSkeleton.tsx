import { Box, Button, Hidden, Icon, List, ListItem } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { range } from 'ramda';
import React from 'react';
import { useIdeaOptionButtonStyle } from 'services';
import { ideaListItemStyle, ideaListStyle } from 'styles';

export interface IdeasSkeletonProps {}

export const IdeasSkeleton: React.FC<IdeasSkeletonProps> = () => {
  const buttonStyle = useIdeaOptionButtonStyle();

  const Row = () => (
    <ListItem style={ideaListItemStyle}>
      {range(0, 2).map((i) => (
        <Button key={i} style={buttonStyle}>
          <Icon>
            <Skeleton variant={'rect'} width={'100%'} height={'100%'} />
          </Icon>
          <Icon>
            <Skeleton variant={'rect'} width={'100%'} height={'100%'} />
          </Icon>
        </Button>
      ))}
      {range(0, 2).map((i) => (
        <Button key={i} style={buttonStyle}>
          <Icon>
            <Skeleton variant={'rect'} width={'100%'} height={'100%'} />
          </Icon>
        </Button>
      ))}
      <Button style={{ ...buttonStyle, flex: 1 }}>
        <Box display="flex" width={'100%'}>
          <Box flex={1}>
            <Skeleton width={120} />
          </Box>
          <Hidden xsDown>
            <Icon>
              <Skeleton variant={'rect'} width={'100%'} height={'100%'} />
            </Icon>
          </Hidden>
        </Box>
      </Button>
    </ListItem>
  );

  return (
    <List style={ideaListStyle}>
      {range(0, 10).map((i) => (
        <Row key={i} />
      ))}
    </List>
  );
};
