import { Box, BoxProps } from '@material-ui/core';
import React from 'react';

export interface IdeaSectionProps extends BoxProps {}

export const IdeaSection: React.FC<IdeaSectionProps> = ({
  children,
  mx = 3,
  my = 4,
  ...props
}) => (
  <Box mx={mx} my={my} {...props}>
    {React.Children.map(children, (child, i) =>
      i === 0 ? <Box mb={2}>{child}</Box> : child,
    )}
  </Box>
);
