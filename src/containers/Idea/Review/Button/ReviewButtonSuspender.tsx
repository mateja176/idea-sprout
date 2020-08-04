import Tab, { TabProps } from '@material-ui/core/Tab';
import { Load } from 'components';
import React from 'react';
import { tabChildStyle } from 'styles';
import { ReviewButton } from './ReviewButton';

export const ReviewButtonSuspender: React.FC<
  React.ComponentProps<typeof ReviewButton> & TabProps
> = ({ reviewOpen, reviewCount, ideaId, uid, onClick, ...props }) => {
  const { style } = props;

  return (
    <React.Suspense
      fallback={
        <Load boxFlex={1}>
          <Tab style={style} />
        </Load>
      }
    >
      <Tab
        {...props}
        label={
          <ReviewButton
            reviewOpen={reviewOpen}
            ideaId={ideaId}
            uid={uid}
            reviewCount={reviewCount}
            style={tabChildStyle}
            onClick={onClick}
          />
        }
        aria-label={'Review'}
      />
    </React.Suspense>
  );
};
