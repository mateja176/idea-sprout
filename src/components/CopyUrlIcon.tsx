import { IconButton } from '@material-ui/core';
import { Link } from '@material-ui/icons';
import { SocialIconProps } from 'models';
import React from 'react';

export interface CopyUrlIconProps extends SocialIconProps {}

export const CopyUrlIcon: React.FC<CopyUrlIconProps> = ({ size }) => (
  <IconButton style={{ width: size, height: size }}>
    <Link />
  </IconButton>
);
