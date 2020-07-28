export interface Drift {
  identify: (id: string, props: Record<string, string | null>) => void;
}
