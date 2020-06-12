import { Link as MaterialLink } from '@material-ui/core';
import React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';

export interface LinkProps extends Omit<NavLinkProps, 'color'> {
  to: string;
}

export const Link: React.FC<LinkProps> = ({ style, ...props }: LinkProps) => {
  return (
    <MaterialLink
      {...props}
      style={{
        ...style,
        color: style?.color ?? 'inherit',
        textDecoration: style?.textDecorationStyle ?? 'none',
      }}
      component={NavLink}
    />
  );
};
