import firebase from 'firebase/app';
import 'firebase/storage';
import { StoragePath, User } from 'models';
import { useState } from 'react';
import { useUser } from 'reactfire';
import { putString } from 'rxfire/storage';
import urljoin from 'url-join';

export const useUpload = (path: StoragePath) => {
  const user = useUser<User>();

  const [status, setStatus] = useState<
    'initial' | 'loading' | 'success' | 'failure'
  >('initial');

  const upload = (files: File[]) => {
    setStatus('loading');

    return Promise.all(
      files.map((file) => {
        const { name } = file;

        const ref = firebase.storage().ref(urljoin(path, user.uid, name));

        const reader = new FileReader();

        reader.readAsDataURL(file);

        return new Promise<string>((resolve) => {
          reader.onload = () => {
            resolve(String(reader.result));
          };
        })
          .then((data) =>
            putString(
              ref,
              data,
              firebase.storage.StringFormat.DATA_URL,
            ).toPromise(),
          )
          .then(({ ref }) => {
            setStatus('success');

            return ref.fullPath;
          });
      }),
    )
      .then((urls) => {
        return urls;
      })
      .catch(() => {
        setStatus('failure');

        return [] as string[];
      });
  };

  return { upload, status };
};
