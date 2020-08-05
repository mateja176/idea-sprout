import { ButtonProps } from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/icons/Menu';
import { SnackbarContext } from 'context';
import React from 'react';
import { useUserState } from 'services';
import { getIsSignedIn } from 'utils';

export const MenuButton: React.FC<Pick<ButtonProps, 'onClick'>> = ({
  onClick,
}) => {
  React.useContext(SnackbarContext); // * user.reload() does not trigger a re-render

  const user = useUserState();
  const isSignedIn = getIsSignedIn(user);

  return isSignedIn ? (
    <IconButton
      onClick={onClick}
      edge="start"
      color="inherit"
      aria-label={'Menu'}
    >
      <Menu />
    </IconButton>
  ) : null;
};
