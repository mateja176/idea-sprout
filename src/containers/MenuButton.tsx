import Box from '@material-ui/core/Box';
import { ButtonProps } from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/icons/Menu';
import React from 'react';
import { useSelector } from 'react-redux';
import { useMaybeUser } from '../hooks/firebase';
import { selectEmailVerified } from '../services/store/slices/auth';
import { getIsSignedIn } from '../utils/auth';

const buttonStyle: React.CSSProperties = {
  marginLeft: 0,
};

export const MenuButton: React.FC<Pick<ButtonProps, 'onClick'>> = ({
  onClick,
}) => {
  useSelector(selectEmailVerified); // * user.reload() does not trigger a re-render

  const user = useMaybeUser();
  const isSignedIn = getIsSignedIn(user);

  const wrapperStyle: React.CSSProperties = React.useMemo(
    () => ({ visibility: isSignedIn ? 'visible' : 'hidden' }),
    [isSignedIn],
  );

  return (
    <Box style={wrapperStyle}>
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
