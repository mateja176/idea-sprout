export interface Drift {
  identify: (id: string, props: Record<string, string | null>) => void;
}

export interface WithDrift {
  drift?: Drift;
}

export type GlobalWithDrift = typeof globalThis & WithDrift;
