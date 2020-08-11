import Box from '@material-ui/core/Box';
import ListItem from '@material-ui/core/ListItem';
import React from 'react';
import { useIdeaOptionsButtonBorder } from 'services/hooks/style';
import { ideaListItemStyle, textSectionStyle } from 'utils/styles/idea';
import { IdeaPreviewWrapper } from '../../../components/Idea/IdeaPreviewWrapper';

export const IdeaOptionsWrapper = ({
  imagePreview,
  textSection,
  shareOption,
  rateOption,
  reviewOption,
  navigateOption,
  style,
  ...props
}: Omit<React.ComponentProps<typeof ListItem>, 'button' | 'children'> & {
  imagePreview: React.ReactNode;
  textSection: React.ReactNode;
  shareOption: React.ReactNode;
  rateOption: React.ReactNode;
  reviewOption: React.ReactNode;
  navigateOption: React.ReactNode;
}) => {
  const buttonBorder = useIdeaOptionsButtonBorder();

  const stopPropagation: React.MouseEventHandler = React.useCallback((e) => {
    e.stopPropagation();
  }, []);

  const listItemStyle: React.CSSProperties = React.useMemo(
    () => ({
      ...ideaListItemStyle,
      display: 'flex',
      width: '100%',
      ...style,
    }),
    [style],
  );

  return (
    <ListItem button {...props} style={listItemStyle}>
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
              {shareOption}
            </Box>
            <Box width={'50%'} height={'100%'}>
              {rateOption}
            </Box>
          </Box>
          <Box display="flex" width={'100%'} height={'50%'}>
            <Box width={'50%'} height={'100%'} borderRight={buttonBorder}>
              {reviewOption}
            </Box>
            <Box width={'50%'} height={'100%'}>
              {navigateOption}
            </Box>
          </Box>
        </Box>
      </IdeaPreviewWrapper>
    </ListItem>
  );
};
