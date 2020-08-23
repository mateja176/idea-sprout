import teal from '@material-ui/core/colors/teal';
import { createMuiTheme } from '@material-ui/core/styles';

export const themePalette = {
  palette: {
    primary: {
      main: teal[500],
      dark: teal[700],
      light: teal[300],
    },
    secondary: {
      main: '#ff5252',
      dark: '#ff1744',
      light: '#ff8a80',
    },
  },
};

export default createMuiTheme(themePalette);
