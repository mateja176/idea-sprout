import { Create, Dashboard, Edit, Person, Search } from '@material-ui/icons';
import { LightBulb } from 'components/icons/LightBulb';
import { NestedRoutes, Route, Routes, ToAbsoluteRec } from 'models';
import React from 'react';
import urljoin from 'url-join';

const flatten = <R extends NestedRoutes>(nestedRoutes: R): any => {
  return Object.entries(nestedRoutes).reduce(
    (routes, [key, { children, ...route }]) => {
      return {
        ...routes,
        [key]: route,
        ...flatten(children),
      };
    },
    {} as Routes,
  );
};

const toAbsoluteRec = (parentPath: string) => <R extends NestedRoutes>(
  routes: R,
): ToAbsoluteRec<R> => {
  return Object.fromEntries(
    Object.entries(routes).map(([key, { children, ...route }]) => {
      const path = urljoin(parentPath, route.path);

      return [
        key,
        {
          ...route,
          path,
          children: toAbsoluteRec(path)(children),
        },
      ];
    }),
  ) as ToAbsoluteRec<R>;
};

export const publicNestedNavigationRoute = {
  signin: {
    path: 'signin',
    label: 'Sign in',
    icon: <Person />,
    children: {},
  },
};
export const absolutePublicNavigationRoutes: Route[] = Object.values(
  flatten(toAbsoluteRec('/')(publicNestedNavigationRoute)),
);

export const nestedPublicRoute = {
  ...publicNestedNavigationRoute,
};
export const absolutePublicRoute = toAbsoluteRec('/')(nestedPublicRoute);

// * Private section

const ideas = {
  path: 'ideas',
  label: 'Discover',
  icon: <Search />,
  children: {
    create: {
      path: 'create',
      label: 'Create',
      icon: <Create />,
      children: {},
    },
    my: {
      path: 'my',
      label: 'My Ideas',
      icon: <LightBulb />,
      children: {},
    },
  },
};

export const privateNestedNavigationRoute = {
  ideas,
};

export const absolutePrivateNavigationRoutes: Route[] = Object.values(
  flatten(toAbsoluteRec('/')(privateNestedNavigationRoute)),
);

export const privateNestedRoute = {
  ideas: {
    ...ideas,
    children: {
      ...ideas.children,
      edit: {
        path: 'edit',
        label: 'Edit',
        icon: <Edit />,
        children: {},
      },
    },
  },
  root: {
    path: '/',
    label: 'Root',
    icon: <Dashboard />,
    children: {},
  },
};
export const absolutePrivateRoute = toAbsoluteRec('/')(privateNestedRoute);
