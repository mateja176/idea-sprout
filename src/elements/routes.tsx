import Dashboard from '@material-ui/icons/Dashboard';
import VideoLibrary from '@material-ui/icons/VideoLibrary';
import React from 'react';
import urljoin from 'url-join';
import { NestedRoutes, Route, Routes, ToAbsoluteRec } from '../models/routes';

/**
 * uses any to circumvent `Type instantiation is excessively deep and possibly infinite.`
 * https://github.com/microsoft/TypeScript/issues/34933
 */
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

export const publicNestedNavigationRoute = {};
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
  label: 'Ideas',
  icon: <VideoLibrary />,
  children: {},
};

export const privateNestedNavigationRoute = {
  ideas,
};

export const absolutePrivateNavigationRoutes: Route[] = Object.values(
  flatten(toAbsoluteRec('/')(privateNestedNavigationRoute)),
);

export const privateNestedRoute = {
  ideas,
  root: {
    path: '/',
    label: 'Root',
    icon: <Dashboard />,
    children: {},
  },
};
export const absolutePrivateRoute = toAbsoluteRec('/')(privateNestedRoute);

export const ideaPath = urljoin(absolutePrivateRoute.ideas.path, ':id');
