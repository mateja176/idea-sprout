import { breakWordStyle } from './styles';

export const ideaListItemHeight = 100;
export const ideaListItemPadding = 10;
export const ideaListItemFullHeight =
  ideaListItemHeight + 2 * ideaListItemPadding;

export const ideaMarginBottom = 15;

export const ideaListStyle: React.CSSProperties = {
  paddingTop: 0,
  paddingBottom: 0,
};

export const ideaListItemStyle: React.CSSProperties = {
  paddingTop: ideaListItemPadding,
  paddingBottom: ideaListItemPadding,
  height: ideaListItemFullHeight,
};

export const ideaNameStyle: React.CSSProperties = { fontSize: '1.2em' };

export const textSectionStyle: React.CSSProperties = {
  ...breakWordStyle,
  flexGrow: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 5,
  WebkitBoxOrient: 'vertical',
};
