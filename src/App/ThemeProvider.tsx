import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import React from 'react';
import { themePalette } from 'styles';

export const ThemeProvider: React.FC = ({ children }) => {
  const themeOverrides = React.useMemo(() => createMuiTheme(themePalette), []);

  return <MuiThemeProvider theme={themeOverrides}>{children}</MuiThemeProvider>;
};
