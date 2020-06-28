import React from 'react';
import { BoxProps, Box } from '@material-ui/core';

export interface IdeaOptionsWrapperProps extends BoxProps {}

export const IdeaOptionsWrapper: React.FC<IdeaOptionsWrapperProps> = (
  props,
) => <Box mx={2} {...props} />;
