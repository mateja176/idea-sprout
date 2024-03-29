export const headerZIndex = 1100;

export const iconSize = 24;

export const tabsLogoHeight = 41;
export const tabsTitleSectionPaddingBottom = 4;
export const tabsTitleSectionHeight =
  tabsLogoHeight + tabsTitleSectionPaddingBottom;

export const mediaBgGreyVariant = 900 as const;

export const logoBorderRadius = 5;

export const ideaSectionMt = 4;
export const ideaSectionMl = 3;

export const logoMr = '6px';
export const nameAndLogoMt = 2;

export const modalMaxWidth = 600;

export const logoWidth = 30;

export const speedDialZIndex = 1050;

export const pageMargin = 3;

export const videoMaxHeight = 720;

export const starColor = '#FFB400';
export const withStarColor = { color: starColor };

export const shareIconSize = 40;

export const checkWithMessageHeight = 64;

export const ideaTabStyle: React.CSSProperties = {
  opacity: 1,
  fontWeight: 'normal',
};

export const withPointer: React.CSSProperties = {
  cursor: 'pointer',
};

export const withEllipsis: React.CSSProperties = {
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflowX: 'hidden',
};
export const withInlineEllipsis: React.CSSProperties = {
  ...withEllipsis,
  display: 'inline-block',
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

export const tabChildStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
};
