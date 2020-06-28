import { useTheme } from '@material-ui/core';

export const useIdeaOptionButtonStyle = () => {
  const theme = useTheme();

  const buttonPadding = theme.spacing(2);
  return {
    paddingTop: buttonPadding,
    paddingBottom: buttonPadding,
  };
};
