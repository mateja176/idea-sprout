import { BoxProps, ListItem } from '@material-ui/core';
import React from 'react';
import { ideaListItemStyle } from 'styles';

export interface IdeaOptionsWrapperProps extends BoxProps {}

export const IdeaOptionsWrapper: React.FC<IdeaOptionsWrapperProps> = ({
  style,
  ...props
}) => <ListItem {...props} style={{ ...ideaListItemStyle, ...style }} />;
