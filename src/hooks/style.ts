import { makeStyles } from '@material-ui/core/styles';
import useTheme from '@material-ui/core/styles/useTheme';
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

export const useReviewPromptStyles = makeStyles((theme) => ({
  tooltip: {
    background: theme.palette.primary.main,
    fontSize: '0.8em',
  },
  arrow: {
    color: theme.palette.primary.main,
  },
}));
