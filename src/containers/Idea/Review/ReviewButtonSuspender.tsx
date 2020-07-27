import { Tab, TabProps } from '@material-ui/core';
import { Load } from 'components';
import React from 'react';
import { tabChildStyle } from 'styles';
import { ReviewButton } from './ReviewButton';

export const ReviewButtonSuspender: React.FC<
  React.ComponentProps<typeof ReviewButton> & TabProps
> = ({ classes, reviewOpen, reviewCount, ideaId, uid, onClick, ...props }) => (
  <React.Suspense
    fallback={
      <Load boxFlex={1}>
        <Tab classes={classes} />
      </Load>
    }
  >
    <Tab
      {...props}
      classes={classes}
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
    />
  </React.Suspense>
);
