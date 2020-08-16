import { NotFound } from 'components/NotFound';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { IdeasSwitchSkeleton } from '../pages/Idea/IdeasSwitchSkeleton';

export const RoutesSkeleton: React.FC = () => {
  return (
    <Switch>
      <IdeasSwitchSkeleton />
      <Route component={NotFound} />
    </Switch>
  );
};
