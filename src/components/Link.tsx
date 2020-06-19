import { Link as MaterialLink } from '@material-ui/core';
import React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';

export interface LinkProps extends Omit<NavLinkProps, 'color'> {
  to: string;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ style, ...props }, ref) => {
    return (
      <MaterialLink
        ref={ref}
        {...props}
        style={{
          ...style,
          color: style?.color ?? 'inherit',
          textDecoration: style?.textDecorationStyle ?? 'none',
        }}
        component={NavLink}
      />
    );
  },
);
