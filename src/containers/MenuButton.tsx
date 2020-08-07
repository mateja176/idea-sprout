import Box from '@material-ui/core/Box';
import { ButtonProps } from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/icons/Menu';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectEmailVerified, useUserState } from 'services';
import { getIsSignedIn } from 'utils';

const buttonStyle: React.CSSProperties = {
  marginLeft: 0,
};

export const MenuButton: React.FC<Pick<ButtonProps, 'onClick'>> = ({
  onClick,
}) => {
  useSelector(selectEmailVerified); // * user.reload() does not trigger a re-render

  const user = useUserState();
  const isSignedIn = getIsSignedIn(user);

  return (
    <Box visibility={isSignedIn ? 'visible' : 'hidden'}>
      <IconButton
        onClick={onClick}
        edge="start"
        color="inherit"
        aria-label={'Menu'}
        style={buttonStyle}
      >
        <Menu />
      </IconButton>
    </Box>
  );
};
