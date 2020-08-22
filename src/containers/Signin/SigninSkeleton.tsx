import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { Theme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Alert from '@material-ui/lab/Alert';
import React from 'react';
import { FacebookIcon, TwitterIcon } from 'react-share';
import { Google } from '../../components/icons/Google';
import { Load } from '../../components/Load';
import { SigninDivider } from '../../components/SigninDivider';
import { logoWidth } from '../../utils/styles/styles';

const fieldMb = `${34}px`;

const SigninSkeleton: React.FC = () => {
  const smAndUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));

  return (
    <Box>
      <Tabs value={false} variant={'fullWidth'}>
        <Load boxFlex={1}>
          <Tab />
        </Load>
        <Load boxFlex={1}>
          <Tab />
        </Load>
      </Tabs>
      <Box
        mt={2}
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
      >
        <Box mb={2}>
          <Load>
            <Alert>Sign in to discover, create and review ideas.</Alert>
          </Load>
        </Box>
        <Box mb={3}>
          <Box mb={fieldMb}>
            <Load>
              <TextField variant={'outlined'} />
            </Load>
          </Box>
          <Box mb={fieldMb}>
            <Load>
              <TextField variant={'outlined'} />
            </Load>
          </Box>
          <Load>
            <Button variant={'contained'}>Sign in</Button>
          </Load>
        </Box>
        <SigninDivider />
        <Box display={'flex'} mb={fieldMb} alignItems={'center'}>
          <Load>
            <TextField variant={'outlined'} />
          </Load>
          <Box ml={1}>
            <Load>
              <Button variant={'contained'}>Send</Button>
            </Load>
          </Box>
        </Box>
        <ButtonGroup>
          <Load>
            <Button startIcon={<Google />}>{smAndUp && 'Google'}</Button>
          </Load>
          <Load>
            <Button startIcon={<FacebookIcon round size={logoWidth} />}>
              {smAndUp && 'Facebook'}
            </Button>
          </Load>
          <Load>
            <Button startIcon={<TwitterIcon round size={logoWidth} />}>
              {smAndUp && 'Twitter'}
            </Button>
          </Load>
        </ButtonGroup>
      </Box>
    </Box>
  );
};

SigninSkeleton.displayName = 'SigninSkeleton';

export default SigninSkeleton;
