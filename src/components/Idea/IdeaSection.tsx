import Box, { BoxProps } from '@material-ui/core/Box';
import React from 'react';

export interface IdeaSectionProps extends BoxProps {}

export const IdeaSection: React.FC<IdeaSectionProps> = ({
  children,
  mx = 3,
  mt = 4,
  mb = 4,
  ...props
}) => (
  <Box mx={mx} mt={mt} mb={mb} {...props}>
    {React.Children.map(children, (child, i) =>
      i === 0 && child ? <Box mb={2}>{child}</Box> : child,
    )}
  </Box>
);
