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

export type ToAbsolute<R extends Routes> = {
  [key in keyof R]: Omit<R[key], 'path'> & { path: string };
};

export type ToAbsoluteRec<R extends NestedRoutes> = {
  [key in keyof R]: Omit<R[key], 'path' | 'children'> & {
    path: string;
    children: ToAbsoluteRec<R[key]['children']>;
  };
};
