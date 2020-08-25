import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import teal from '@material-ui/core/colors/teal';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import Menu from '@material-ui/icons/Menu';
import { useBoolean } from 'ahooks';
import React from 'react';
import IconButtonSuspender from '../../components/IconButtonSuspender';
import { IdeaSprout } from '../../components/icons/IdeaSprout';
import { Link } from '../../components/Link';
import { CreateIdeaIcon } from '../../containers/Idea/Create/CreateIdeaIcon';
import { IdeaHelpContainer } from '../../containers/Idea/Help/IdeaHelpContainer';
import { MenuButton } from '../../containers/MenuButton';
import { PreloadContext } from '../../context/preload';
import { absolutePrivateRoute } from '../../elements/routes';
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

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const preloaded = React.useContext(PreloadContext);

  const classes = useStyles();

  const [drawerOpen, setDrawerOpen] = useBoolean();

  const drawerClasses = useDrawerStyles();

  return (
    <Box height={'100%'} display={'flex'} flexDirection={'column'}>
      <AppBar position="static">
        <Toolbar>
          <Box mr={2}>
            {preloaded.hasWindow ? (
              <IconButtonSuspender>
                <MenuButton onClick={setDrawerOpen.setTrue} />
              </IconButtonSuspender>
            ) : (
              <Box visibility={'hidden'}>
                <IconButton>
                  <Menu />
                </IconButton>
              </Box>
            )}
          </Box>
          <Box flex={1} display={'flex'}>
            <Box
              mr={1}
              bgcolor={teal[50]}
              width={'2em'}
              height={'2em'}
              borderRadius={'50%'}
              boxSizing={'initial'}
              border={`3px solid ${teal[50]}`}
            >
              <IdeaSprout width={'100%'} height={'100%'} />
            </Box>
            <Link to={absolutePrivateRoute.ideas.path}>
              <Typography variant="h6">Idea Sprout</Typography>
            </Link>
          </Box>
          <Box mr={1}>
            {preloaded.hasWindow && (
              <IconButtonSuspender>
                <IdeaHelpContainer />
              </IconButtonSuspender>
            )}
          </Box>
          {preloaded.hasWindow && (
            <IconButtonSuspender>
              <CreateIdeaIcon />
            </IconButtonSuspender>
          )}
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
          {preloaded.hasWindow && (
            <React.Suspense fallback={<NavSkeleton />}>
              <Nav onClick={setDrawerOpen.setFalse} />
            </React.Suspense>
          )}
        </Box>
      </Drawer>
      {children}
    </Box>
  );
};

Layout.displayName = 'Layout';

export default Layout;
