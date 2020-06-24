import React from 'react';
import { Box, useTheme, fade } from '@material-ui/core';

export interface ButtonGroupProps {
  children: (props: {
    firstStyle: React.CSSProperties;
    style: React.CSSProperties;
    lastStyle: React.CSSProperties;
  }) => React.ReactElement;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({ children }) => {
  const theme = useTheme();

  const style: React.CSSProperties = {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: fade(theme.palette.action.active, 0.4),
    borderStyle: 'solid',
    borderRadius: 0,
  };

  const firstStyle: React.CSSProperties = {
    ...style,
    borderLeftWidth: 1,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  };

  const lastStyle: React.CSSProperties = {
    ...style,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  };

  return (
    <Box display="flex" width={'100%'}>
      {children({ firstStyle, style, lastStyle })}
    </Box>
  );
};
