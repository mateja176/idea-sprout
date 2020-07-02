export const ideaListItemHeight = 100;
export const ideaListItemPadding = 10;
export const ideaListItemFullHeight =
  ideaListItemHeight + 2 * ideaListItemPadding;

export const ideaMarginBottom = 15;

export const logoWidth = 30;

export const navIconWidth = 24;

export const speedDialZIndex = 1050;

export const pageMargin = 3;

export const videoMaxHeight = 720;

export const starColor = '#FFB400';

export const shareIconSize = 40;

export const withEllipsis: React.CSSProperties = {
  display: 'inline-block',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflowX: 'hidden',
};

export const inputStyle: React.CSSProperties = {
  display: 'block',
  height: 70,
  marginBottom: 20,
};
export const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  height: 146,
};

export const breakWordStyle: React.CSSProperties = {
  wordBreak: 'break-word',
};

export const ideaListStyle: React.CSSProperties = {
  paddingTop: 0,
  paddingBottom: 0,
};

export const ideaListItemStyle: React.CSSProperties = {
  paddingTop: ideaListItemPadding,
  paddingBottom: ideaListItemPadding,
  height: ideaListItemFullHeight,
};
