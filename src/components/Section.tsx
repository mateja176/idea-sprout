import { Box, BoxProps } from '@material-ui/core';
import React from 'react';

export interface SectionProps extends BoxProps {}

export const Section: React.FC<SectionProps> = ({
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
