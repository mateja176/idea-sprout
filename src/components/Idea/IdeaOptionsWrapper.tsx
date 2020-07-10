import { ListItem, ListItemProps } from '@material-ui/core';
import React from 'react';
import { ideaListItemStyle } from 'styles';

export const IdeaOptionsWrapper: React.FC<Omit<ListItemProps, 'button'>> = ({
  style,
  ...props
}) => (
  <ListItem
    button={true as any}
    {...props}
    style={{ ...ideaListItemStyle, ...style }}
  />
);
