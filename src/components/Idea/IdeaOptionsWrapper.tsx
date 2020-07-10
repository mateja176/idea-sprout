import { Box, ListItem, ListItemProps } from '@material-ui/core';
import React from 'react';
import { ideaListItemStyle, textSectionStyle } from 'styles';

export const IdeaOptionsWrapper = ({
  imagePreview,
  textSection,
  options,
  style,
  ...props
}: Omit<ListItemProps, 'button' | 'children'> & {
  imagePreview: React.ReactNode;
  textSection: React.ReactNode;
  options: React.ReactNode;
}) => {
  return (
    <ListItem
      button={true as any}
      {...props}
      style={{
        ...ideaListItemStyle,
        display: 'flex',
        width: '100%',
        ...style,
      }}
    >
      <Box mr={1}>{imagePreview}</Box>
      <Box mr={1} style={textSectionStyle}>
        {textSection}
      </Box>
      {options}
    </ListItem>
  );
};
