import { Tab } from '@material-ui/core';
import { Load } from 'components';
import React from 'react';
import { ExportReviews } from './ExportReviews';

export const ExportReviewSuspender: typeof ExportReviews = (props) => {
  const { classes } = props;

  return (
    <React.Suspense
      fallback={
        <Load boxFlex={1}>
          <Tab classes={classes} />
        </Load>
      }
    >
      <ExportReviews {...props} />
    </React.Suspense>
  );
};
