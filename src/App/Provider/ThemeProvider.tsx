import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import { removeJSSStyle } from '../../services/services';
import theme from '../../utils/styles/theme';

export const ThemeProvider: React.FC = ({ children }) => {
  React.useEffect(() => {
    removeJSSStyle();
  }, []);

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};
