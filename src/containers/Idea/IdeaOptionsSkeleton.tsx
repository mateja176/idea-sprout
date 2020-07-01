import { Box, Button, Icon, ListItem } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { range } from 'ramda';
import React from 'react';
import { useIdeaOptionButtonStyle } from 'services';
import { ideaListItemStyle } from 'styles';

export const IdeaOptionSkeleton = () => {
  const buttonStyle = useIdeaOptionButtonStyle();

  return (
    <Button style={buttonStyle}>
      <Icon>
        <Skeleton variant={'rect'} width={'100%'} height={'100%'} />
      </Icon>
    </Button>
  );
};

export const IdeaDoubleOptionSkeleton = () => {
  const buttonStyle = useIdeaOptionButtonStyle();

  return (
    <Button style={buttonStyle}>
      <Icon>
        <Skeleton variant={'rect'} width={'100%'} height={'100%'} />
      </Icon>
      <Icon>
        <Skeleton variant={'rect'} width={'100%'} height={'100%'} />
      </Icon>
    </Button>
  );
};

export const IdeaOptionsSkeleton: React.FC<{
  secondaryActionIcon: React.ReactNode;
}> = ({ secondaryActionIcon }) => {
  const buttonStyle = useIdeaOptionButtonStyle();

  return (
    <ListItem style={ideaListItemStyle}>
      {range(0, 2).map((i) => (
        <IdeaDoubleOptionSkeleton key={i} />
      ))}
      {range(0, 2).map((i) => (
        <IdeaOptionSkeleton key={i} />
      ))}
      <Button style={{ ...buttonStyle, flex: 1 }}>
        <Box display="flex" width={'100%'}>
          <Box flex={1}>
            <Skeleton width={120} />
          </Box>
          {secondaryActionIcon}
        </Box>
      </Button>
    </ListItem>
  );
};
