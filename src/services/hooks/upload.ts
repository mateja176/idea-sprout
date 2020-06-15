import firebase from 'firebase/app';
import 'firebase/storage';
import { useState } from 'react';
import { getDownloadURL, putString } from 'rxfire/storage';
import { resolve } from 'url';

export const useUpload = (path: string) => {
  const [status, setStatus] = useState<
    'initial' | 'loading' | 'success' | 'failure'
  >('initial');

  const upload = (files: File[]) => {
    setStatus('loading');

    return Promise.all(
      files.map((file) => {
        const { name } = file;

        const ref = firebase.storage().ref(resolve(path, name));

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
          .then(() => {
            return getDownloadURL(ref).toPromise();
          });
      }),
    )
      .then((urls) => {
        setStatus('success');

        return urls;
      })
      .catch(() => {
        setStatus('failure');

        return [] as string[];
      });
  };

  return { upload, status };
};
