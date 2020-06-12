export interface NavRoute {
  path: string;
  label: string;
  icon: React.ReactElement;
}

export type NavRoutes = NavRoute[];

export type Routes = Record<string, NavRoute>;
