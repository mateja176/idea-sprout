import React from 'react';
import { Redirect } from 'react-router-dom';
import { absolutePrivateRoute } from '../../elements/routes';

const RedirectToIdeas: React.FC = () => (
  <Redirect to={absolutePrivateRoute.ideas.path} />
);

export default RedirectToIdeas;
