import { useTheme } from '@material-ui/core';

export const useIdeaOptionButtonStyle = () => {
  const theme = useTheme();

  return {
    padding: 0,
    height: '100%',
    width: '100%',
    minWidth: 'auto',
    color: theme.palette.action.active,
  };
};
