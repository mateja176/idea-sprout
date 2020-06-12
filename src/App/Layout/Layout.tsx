import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { ChevronLeft, Menu } from '@material-ui/icons';
import React from 'react';
import { Nav } from './Nav';

export interface LayoutProps {}

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
}));

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const classes = useStyles();

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawerOpen = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Box mr={2}>
            <IconButton onClick={toggleDrawerOpen} edge="start" color="inherit">
              <Menu />
            </IconButton>
          </Box>
          <Box flex={1}>
            <Typography variant="h6">Idea Sprout</Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawerOpen}>
        <Box className={classes.toolbar}>
          <Box
            className={classes.toolbar}
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            pr={1}
            boxShadow="0px -1px 0px #ccc inset"
          >
            <IconButton onClick={toggleDrawerOpen}>
              <ChevronLeft />
            </IconButton>
          </Box>
          <Nav />
        </Box>
      </Drawer>
      <Box>{children}</Box>
    </Box>
  );
};
