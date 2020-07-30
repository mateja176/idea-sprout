import {
  AppBar,
  Box,
  colors,
  Drawer,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { ChevronLeft, LibraryAdd, Menu } from '@material-ui/icons';
import { IdeaSprout, Link, Load } from 'components';
import { CreateIdeaIcon } from 'containers';
import { IdeaHelpContainer } from 'containers/Idea/IdeaHelpContainer';
import React from 'react';
import { absolutePrivateRoute } from 'utils';
import { minNavWidth, Nav, NavSkeleton } from './Nav';

export interface LayoutProps {}

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  paper: {
    minWidth: minNavWidth,
  },
}));

const loadIconButton = (
  <Load variant={'circle'}>
    <IconButton>
      <LibraryAdd />
    </IconButton>
  </Load>
);
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const classes = useStyles();

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawerOpen = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box height={'100%'} display={'flex'} flexDirection={'column'}>
      <AppBar position="static">
        <Toolbar>
          <Box mr={2}>
            <IconButton onClick={toggleDrawerOpen} edge="start" color="inherit">
              <Menu />
            </IconButton>
          </Box>
          <Box flex={1} display={'flex'}>
            <Box
              mr={1}
              bgcolor={colors.teal[50]}
              width={'2em'}
              height={'2em'}
              borderRadius={'50%'}
              boxSizing={'initial'}
              border={`3px solid${colors.teal[50]}`}
            >
              <IdeaSprout width={'100%'} height={'100%'} />
            </Box>
            <Link to={absolutePrivateRoute.ideas.path}>
              <Typography variant="h6">Idea Sprout</Typography>
            </Link>
          </Box>
          <React.Suspense fallback={loadIconButton}>
            <IdeaHelpContainer />
          </React.Suspense>
          <React.Suspense fallback={loadIconButton}>
            <CreateIdeaIcon />
          </React.Suspense>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawerOpen}
        classes={{
          paper: classes.paper,
        }}
      >
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
          <React.Suspense fallback={<NavSkeleton />}>
            <Nav onClick={toggleDrawerOpen} />
          </React.Suspense>
        </Box>
      </Drawer>
      {children}
    </Box>
  );
};
