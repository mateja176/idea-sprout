import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NotFound } from '../../components/NotFound';
import { IdeasSwitchSkeleton } from '../pages/idea/Switch/IdeasSwitchSkeleton';

export const RoutesSkeleton: React.FC = () => {
  return (
    <Switch>
      <IdeasSwitchSkeleton />
      <Route component={NotFound} />
    </Switch>
  );
};
