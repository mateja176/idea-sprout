import Box from '@material-ui/core/Box';
import Tab, { TabProps } from '@material-ui/core/Tab';
import Tooltip from '@material-ui/core/Tooltip';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { tabChildStyle } from 'styles';
import { absolutePrivateRoute } from 'utils/routes';

export const BackToIdeas: React.FC<Omit<TabProps, 'onClick' | 'label'>> = ({
  ...props
}) => {
  const history = useHistory();

  const handleClick: React.MouseEventHandler = React.useCallback(() => {
    history.push(absolutePrivateRoute.ideas.path);
  }, [history]);

  return (
    <Tab
      {...props}
      onClick={handleClick}
      label={
        <Tooltip title={'Back to ideas'}>
          <Box style={tabChildStyle}>
            <KeyboardArrowLeft color={'action'} />
          </Box>
        </Tooltip>
      }
      aria-label={'Back to ideas'}
    />
  );
};
