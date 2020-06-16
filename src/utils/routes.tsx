import { Create, Person } from '@material-ui/icons';
import { LightBulb } from 'components/icons/LightBulb';
import { Routes } from 'models';
import React from 'react';
import urljoin from 'url-join';

const toAbsolute = <R extends Routes>(routes: R) =>
  Object.fromEntries(
    Object.entries(routes).map(([key, { path, ...route }]) => [
      key,
      {
        ...route,
        path: urljoin('/', path),
      },
    ]),
  );

export const publicRoute = {
  login: {
    path: 'signin',
    label: 'Sign in',
    icon: <Person />,
  },
};

export const absolutePublicRoute = toAbsolute(publicRoute);

export const absolutePublicRoutes = Object.values(publicRoute);

export const privateRoute = {
  create: {
    path: 'create',
    label: 'Create',
    icon: <Create />,
  },
  ideas: {
    path: 'ideas',
    label: 'Ideas',
    icon: <LightBulb />,
  },
};

export const absolutePrivateRoute = toAbsolute(privateRoute);

export const absolutePrivateRoutes = Object.values(privateRoute);
