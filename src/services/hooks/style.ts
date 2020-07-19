import { makeStyles, useTheme } from '@material-ui/core';
import { useMemo } from 'react';

export const useIdeaOptionButtonStyle = () => {
  const theme = useTheme();

  return useMemo(
    () => ({
      padding: 0,
      height: '100%',
      width: '100%',
      minWidth: 'auto',
      color: theme.palette.action.active,
    }),
    [theme],
  );
};

export const useIdeaOptionsButtonBorder = () => {
  const theme = useTheme();

  return useMemo(() => `1px solid ${theme.palette.grey[600]}`, [theme]);
};

export const useIdeaTabStyles = makeStyles(() => ({
  textColorInherit: {
    opacity: 1,
    fontWeight: 'normal',
  },
}));
