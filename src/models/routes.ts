import { ReactElement } from 'react';

export interface Route {
  path: string;
  label: string;
  icon: React.ReactElement;
}

export type Routes = Record<string, Route>;

export interface NestedRoute extends Route {
  children: NestedRoutes;
}

export type NestedRoutes = Record<string, NestedRoute>;

export type GetNestedRouteKey<R extends NestedRoutes> = {
  [key in keyof R]:
    | key
    | keyof R[key]['children']
    | GetNestedRouteKey<R[key]['children']>;
}[keyof R];

// * Example
type A = {
  ideas: {
    path: 'ideas';
    label: 'Discover';
    icon: ReactElement;
    children: {
      create: {
        path: 'create';
        label: 'Create';
        icon: ReactElement;
        children: {};
      };
      my: {
        path: 'my';
        label: 'My Ideas';
        icon: ReactElement;
        children: {
          published: {
            path: 'published';
            label: 'Published';
            icon: ReactElement;
            children: {};
          };
        };
      };
    };
  };
};
type B = GetNestedRouteKey<A>; // "ideas" | "create" | "my" | "published"

// export type FlattenRoutes<R extends NestedRoutes> = Record<GetNestedRouteKey<R>, Route>;

export type ToAbsolute<R extends Routes> = {
  [key in keyof R]: Omit<R[key], 'path'> & { path: string };
};

type C = ToAbsolute<A>;

export type ToAbsoluteRec<R extends NestedRoutes> = {
  [key in keyof R]: Omit<R[key], 'path' | 'children'> & {
    path: string;
    children: ToAbsoluteRec<R[key]['children']>;
  };
};

type D = ToAbsoluteRec<A>;
