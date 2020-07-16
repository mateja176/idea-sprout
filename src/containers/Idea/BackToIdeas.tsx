import { Box, Tab, TabProps, useTheme } from '@material-ui/core';
import { KeyboardArrowLeft } from '@material-ui/icons';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useLinkStyle } from 'services';
import { absolutePrivateRoute } from 'utils';

export const BackToIdeas: React.FC<Omit<TabProps, 'onClick' | 'label'>> = ({
  classes,
  ...props
}) => {
  const theme = useTheme();

  const linkStyle = useLinkStyle();

  const history = useHistory();

  const handleClick: React.MouseEventHandler = React.useCallback(() => {
    history.push(absolutePrivateRoute.ideas.path);
  }, [history]);

  return (
    <Tab
      {...props}
      onClick={handleClick}
      classes={{ ...classes, ...linkStyle }}
      label={
        <Box display={'flex'} color={theme.palette.action.active}>
          <KeyboardArrowLeft />
          &nbsp; Back
        </Box>
      }
    />
  );
};
