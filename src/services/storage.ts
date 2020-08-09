import { arrayToMap } from 'utils/utils';

export const localStorageKeys = ['shouldRunTour'] as const;
export type LocalStorageKeys = typeof localStorageKeys;
export type LocalStorageKey = LocalStorageKeys[number];
export const localStorageKey = arrayToMap(localStorageKeys);

export type LocalStorageItems = {
  [localStorageKey.shouldRunTour]: boolean;
};

export type Unsubscribe = () => void;
export type Subscriber<Key extends LocalStorageKey> = {
  key: Key;
  callback: <Action extends 'initial' | 'set' | 'remove'>(
    action: Action,
    value: Action extends 'remove' ? null : LocalStorageItems[Key],
  ) => void;
};

type SubScriberMap = {
  [Key in LocalStorageKey]: Subscriber<Key>['callback'][];
};

export const initialSubscribers: SubScriberMap = {
  shouldRunTour: [],
};

export interface LocalStorage {
  getItem: <Key extends LocalStorageKey>(key: Key) => LocalStorageItems[Key];
  setItem: <Key extends LocalStorageKey>(
    key: Key,
    value: LocalStorageItems[Key],
  ) => void;
  removeItem: (key: LocalStorageKey) => void;
  clear: () => void;
  subscribe: <Key extends LocalStorageKey>(
    key: Key,
    callback: Subscriber<Key>['callback'],
  ) => Unsubscribe;
}

const subscribersRef = { current: initialSubscribers };

export const storage: LocalStorage = {
  getItem: (key) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },
  setItem: (key, value) => {
    subscribersRef.current[key].forEach((callback) => {
      callback('set', value);
    });

    localStorage.setItem(key, String(value));
  },
  removeItem: (key: LocalStorageKey) => {
    subscribersRef.current[key].forEach((callback) => {
      callback('remove', null);
    });

    localStorage.remove(localStorage);
  },
  clear: () => {
    localStorage.clear();

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
