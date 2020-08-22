import Tab from '@material-ui/core/Tab';
import React from 'react';
import { Load } from '../../../../components/Load';
import { ExportReviews } from './ExportReviews';

export const ExportReviewSuspender: typeof ExportReviews = (props) => {
  const { style } = props;

  return (
    <React.Suspense
      fallback={
        <Load boxFlex={1}>
          <Tab style={style} />
        </Load>
      }
    >
      <ExportReviews {...props} />
    </React.Suspense>
  );
};
