import Link from '@material-ui/core/Link';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import School from '@material-ui/icons/School';
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
