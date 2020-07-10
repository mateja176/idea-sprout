import { Box, ListItem, ListItemProps } from '@material-ui/core';
import React from 'react';
import { useIdeaOptionsButtonBorder } from 'services';
import { ideaListItemStyle, textSectionStyle } from 'styles';
import { IdeaPreviewWrapper } from './IdeaPreviewWrapper';

export const IdeaOptionsWrapper = ({
  imagePreview,
  textSection,
  options: { share, rate, review, navigate },
  style,
  ...props
}: Omit<ListItemProps, 'button' | 'children'> & {
  imagePreview: React.ReactNode;
  textSection: React.ReactNode;
  options: {
    share: React.ReactNode;
    rate: React.ReactNode;
    review: React.ReactNode;
    navigate: React.ReactNode;
  };
}) => {
  const buttonBorder = useIdeaOptionsButtonBorder();

  const stopPropagation: React.MouseEventHandler = (e) => {
    e.stopPropagation();
  };

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
      <IdeaPreviewWrapper>
        <Box
          width={'100%'}
          height={'100%'}
          border={buttonBorder}
          borderRadius={5}
          onClick={stopPropagation}
        >
          <Box
            display="flex"
            width={'100%'}
            height={'50%'}
            borderBottom={buttonBorder}
          >
            <Box width={'50%'} height={'100%'} borderRight={buttonBorder}>
              {share}
            </Box>
            <Box width={'50%'} height={'100%'}>
              {rate}
            </Box>
          </Box>
          <Box display="flex" width={'100%'} height={'50%'}>
            <Box width={'50%'} height={'100%'} borderRight={buttonBorder}>
              {review}
            </Box>
            <Box width={'50%'} height={'100%'}>
              {navigate}
            </Box>
          </Box>
        </Box>
      </IdeaPreviewWrapper>
    </ListItem>
  );
};
