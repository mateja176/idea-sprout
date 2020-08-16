import Box from '@material-ui/core/Box';
import Tab, { TabProps } from '@material-ui/core/Tab';
import Tooltip from '@material-ui/core/Tooltip';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import { Link } from 'components/Link';
import { absolutePrivateRoute } from 'elements/routes';
import React from 'react';
import { tabChildStyle } from 'utils/styles/styles';

export const IdeasLink: React.FC<Omit<TabProps, 'onClick' | 'label'>> = (
  props,
) => {
  return (
    <Link to={absolutePrivateRoute.ideas.path}>
      <Tab
        {...props}
        label={
          <Tooltip title={'All ideas'}>
            <Box style={tabChildStyle}>
              <KeyboardArrowLeft color={'action'} />
            </Box>
          </Tooltip>
        }
        aria-label={'All ideas'}
      />
    </Link>
  );
};
