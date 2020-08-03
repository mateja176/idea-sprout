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
import { useBoolean } from 'ahooks';
import { IdeaSprout, Link, Load } from 'components';
import { CreateIdeaIcon } from 'containers';
import { IdeaHelpContainer } from 'containers/Idea/IdeaHelpContainer';
import { WithUserState } from 'models';
import React from 'react';
import { absolutePrivateRoute, getIsSignedIn, isFirebaseUser } from 'utils';
import { minNavWidth, Nav, NavSkeleton } from './Nav';

export interface LayoutProps extends WithUserState {}

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
export const Layout: React.FC<LayoutProps> = ({ user, children }) => {
  const isSignedIn = getIsSignedIn(user);

  const classes = useStyles();

  const [drawerOpen, setDrawerOpen] = useBoolean();

  const drawerClasses = React.useMemo(
    () => ({
      paper: classes.paper,
    }),
    [classes],
  );

  return (
    <Box height={'100%'} display={'flex'} flexDirection={'column'}>
      <AppBar position="static">
        <Toolbar>
          <Box mr={2} visibility={isSignedIn ? 'visible' : 'hidden'}>
            <IconButton
              onClick={setDrawerOpen.setTrue}
              edge="start"
              color="inherit"
            >
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
          <Box mr={1}>
            <React.Suspense fallback={loadIconButton}>
              <IdeaHelpContainer />
            </React.Suspense>
          </Box>
          <React.Suspense fallback={loadIconButton}>
            <CreateIdeaIcon />
          </React.Suspense>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={setDrawerOpen.setFalse}
        classes={drawerClasses}
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
            <IconButton onClick={setDrawerOpen.setFalse}>
              <ChevronLeft />
            </IconButton>
          </Box>
          {isFirebaseUser(user) && (
            <React.Suspense fallback={<NavSkeleton />}>
              <Nav
                isSignedIn={isSignedIn}
                user={user}
                onClick={setDrawerOpen.setFalse}
              />
            </React.Suspense>
          )}
        </Box>
      </Drawer>
      {children}
    </Box>
  );
};
