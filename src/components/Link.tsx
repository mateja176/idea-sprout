import MaterialLink from '@material-ui/core/Link';
import React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';

export interface LinkProps
  extends Pick<NavLinkProps, 'style' | 'onClick' | 'children' | 'target'> {
  to: string;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ style, ...props }, ref) => {
    const linkStyle: React.CSSProperties = React.useMemo(
      () => ({
        color: 'inherit',
        textDecoration: 'none',
        ...style,
      }),
      [style],
    );
    return (
      <MaterialLink
        ref={ref}
        {...props}
        style={linkStyle}
        component={NavLink}
      />
    );
  },
);
