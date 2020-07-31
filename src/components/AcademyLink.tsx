import {
  Link,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@material-ui/core';
import { School } from '@material-ui/icons';
import React from 'react';

export const linkStyle: React.CSSProperties = {
  textDecoration: 'none',
};

export const AcademyLink: React.FC = () => (
  <Link
    href={'https://startupsprout.wordpress.com'}
    target={'__blank'}
    style={linkStyle}
  >
    <Tooltip title={'Get inspired'}>
      <ListItem button>
        <ListItemIcon>
          <School color={'primary'} />
        </ListItemIcon>
        <ListItemText>Academy</ListItemText>
      </ListItem>
    </Tooltip>
  </Link>
);
