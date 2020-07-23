import {
  createMuiTheme,
  ThemeProvider as MuiThemeProvider,
} from '@material-ui/core';
import React from 'react';
import { themePalette } from 'styles';

export const ThemeProvider: React.FC = ({ children }) => {
  const themeOverrides = React.useMemo(() => createMuiTheme(themePalette), []);

  return <MuiThemeProvider theme={themeOverrides}>{children}</MuiThemeProvider>;
};
