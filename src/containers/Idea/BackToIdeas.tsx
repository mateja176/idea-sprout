import { Box, Tab, TabProps, Tooltip } from '@material-ui/core';
import { KeyboardArrowLeft } from '@material-ui/icons';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { tabChildStyle } from 'styles';
import { absolutePrivateRoute } from 'utils';

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
