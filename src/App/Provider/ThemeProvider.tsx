import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import theme from '../../utils/styles/theme';

export const ThemeProvider: React.FC = ({ children }) => {
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};
