import { arrayToMap } from 'utils/utils';

export const localStorageKeys = ['shouldRunTour', 'email'] as const;
export type LocalStorageKeys = typeof localStorageKeys;
export type LocalStorageKey = LocalStorageKeys[number];
export const localStorageKey = arrayToMap(localStorageKeys);

export type LocalStorageItems = {
  [localStorageKey.shouldRunTour]: boolean;
  [localStorageKey.email]: string;
};

export type Unsubscribe = () => void;

export type StorageAction = 'initial' | 'set' | 'remove';

export type StorageValue = LocalStorageItems[keyof LocalStorageItems] | null;

export type StorageSubscribe = (
  action: StorageAction,
  value: StorageValue,
) => void;

type Subscribers = { [key in LocalStorageKey]: StorageSubscribe[] };

export const initialSubscribers: Subscribers = {
  shouldRunTour: [],
  email: [],
};

const subscribersRef = { current: initialSubscribers };

export type Storage = {
  getItem: <Key extends LocalStorageKey>(key: Key) => LocalStorageItems[Key];
  setItem: <Key extends LocalStorageKey>(
    key: Key,
    value: LocalStorageItems[Key],
  ) => void;
  removeItem: <Key extends LocalStorageKey>(key: Key) => void;
  clear: () => void;
  subscribe: <Key extends LocalStorageKey>(
    key: Key,
    callback: (action: StorageAction, value: StorageValue) => void,
  ) => Unsubscribe;
};

export const storage: Storage = {
  getItem: (key) => {
    const value = globalThis.localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },
  setItem: (key, value) => {
    globalThis.localStorage.setItem(key, JSON.stringify(value));

    subscribersRef.current[key].forEach((callback) => {
      callback('set', value);
    });
  },
  removeItem: (key) => {
    globalThis.localStorage.removeItem(key);

    subscribersRef.current[key].forEach((callback) => {
      callback('remove', null);
    });
  },
  clear: () => {
    globalThis.localStorage.clear();

    Object.values(subscribersRef.current).forEach((callbacks) => {
      callbacks.forEach((callback) => {
        callback('remove', null);
      });
    });
  },
  subscribe: (key, callback) => {
    callback('initial', storage.getItem(key));

    subscribersRef.current = {
      ...subscribersRef.current,
      [key]: [...subscribersRef.current[key], callback],
    };

    return () => {
      subscribersRef.current = {
        ...subscribersRef.current,
        [key]: subscribersRef.current[key].filter((cb) => cb === callback),
      };
    };
  },
};
