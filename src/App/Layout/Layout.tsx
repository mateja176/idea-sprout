import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import teal from '@material-ui/core/colors/teal';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import LibraryAdd from '@material-ui/icons/LibraryAdd';
import { useBoolean } from 'ahooks';
import { IdeaSprout } from 'components/icons/IdeaSprout';
import { Link } from 'components/Link';
import { Load } from 'components/Load';
import { CreateIdeaIcon } from 'containers/Idea/Create/CreateIdeaIcon';
import { IdeaHelpContainer } from 'containers/Idea/Help/IdeaHelpContainer';
import { MenuButton } from 'containers/MenuButton';
import { absolutePrivateRoute } from 'elements/routes';
import React from 'react';
import './Layout.css';
import { minNavWidth, Nav } from './Nav/Nav';
import { NavSkeleton } from './Nav/NavSkeleton';

export interface LayoutProps {}

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
}));

const useDrawerStyles = makeStyles(() => ({
  paper: {
    minWidth: minNavWidth,
  },
}));

const loadIconButton = (
  <Load variant={'circle'}>
    <IconButton aria-label={'Create idea'}>
      <LibraryAdd />
    </IconButton>
  </Load>
);
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const classes = useStyles();

  const [drawerOpen, setDrawerOpen] = useBoolean();

  const drawerClasses = useDrawerStyles();

  return (
    <Box height={'100%'} display={'flex'} flexDirection={'column'}>
      <AppBar position="static">
        <Toolbar>
          <Box mr={2}>
            <React.Suspense fallback={loadIconButton}>
              <MenuButton onClick={setDrawerOpen.setTrue} />
            </React.Suspense>
          </Box>
          <Box flex={1} display={'flex'}>
            <Box
              mr={1}
              bgcolor={teal[50]}
              width={'2em'}
              height={'2em'}
              borderRadius={'50%'}
              boxSizing={'initial'}
              border={`3px solid${teal[50]}`}
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
            <IconButton
              onClick={setDrawerOpen.setFalse}
              aria-label={'Close menu'}
            >
              <ChevronLeft />
            </IconButton>
          </Box>
          <React.Suspense fallback={<NavSkeleton />}>
            <Nav onClick={setDrawerOpen.setFalse} />
          </React.Suspense>
        </Box>
      </Drawer>
      {children}
    </Box>
  );
};
