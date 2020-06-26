import { Create, Edit, Person, Search } from '@material-ui/icons';
import { LightBulb } from 'components/icons/LightBulb';
import { Routes } from 'models';
import React from 'react';
import urljoin from 'url-join';

const toAbsolute = <R extends Routes>(routes: R) => {
  const entries = Object.entries(routes).map(([key, { path, ...route }]) => [
    key,
    {
      ...route,
      path: urljoin('/', path),
    },
  ]);
  return Object.fromEntries(entries) as {
    [key in keyof R]: Omit<R[key], 'path'> & { path: string };
  };
};

export const publicNavigationRoute = {
  signin: {
    path: 'signin',
    label: 'Sign in',
    icon: <Person />,
  },
};

export const publicRoute = {
  ...publicNavigationRoute,
};

export const absolutePublicNavigationRoutes = Object.values(
  publicNavigationRoute,
);

export const absolutePublicRoute = toAbsolute(publicRoute);

export const privateNavigationRoute = {
  ideas: {
    path: '/',
    label: 'Discover',
    icon: <Search />,
  },
  create: {
    path: 'create',
    label: 'Create',
    icon: <Create />,
  },
  myIdeas: {
    path: 'my-ideas',
    label: 'My Ideas',
    icon: <LightBulb />,
  },
};

export const privateRoute = {
  ...privateNavigationRoute,
  edit: {
    path: 'edit',
    label: 'Edit',
    icon: <Edit />,
  },
};

export const absolutePrivateNavigationRoutes = Object.values(
  privateNavigationRoute,
);

export const absolutePrivateRoute = toAbsolute(privateRoute);
