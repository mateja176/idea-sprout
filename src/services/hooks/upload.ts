import firebase from 'firebase/app';
import 'firebase/storage';
import { StorageFile, StoragePath, User } from 'models';
import { useState } from 'react';
import { useStorage, useUser } from 'reactfire';
import { putString } from 'rxfire/storage';
import { createQueueSnackbar } from 'services/store';
import urljoin from 'url-join';
import { useActions } from './hooks';

export const useUpload = (path: StoragePath) => {
  const { queueSnackbar } = useActions({
    queueSnackbar: createQueueSnackbar,
  });

  const user = useUser<User>();

  const [status, setStatus] = useState<
    'initial' | 'loading' | 'success' | 'failure'
  >('initial');

  const storage = useStorage();

  const upload = (files: File[]): Promise<StorageFile[]> => {
    setStatus('loading');

    return Promise.all(
      files.map((file) => {
        const { name } = file;

        const ref = storage.ref(urljoin(path, user.uid, name));

        const reader = new FileReader();

        reader.readAsDataURL(file);

        return new Promise<string>((resolve) => {
          reader.onload = () => {
            resolve(String(reader.result));
          };
        })
          .then((data) => {
            const size =
              path === 'images'
                ? new Promise<HTMLImageElement>((resolve) => {
                    const instance = new Image();

                    instance.src = data;

                    instance.addEventListener('load', () => {
                      resolve(instance);
                    });
                  }).then((instance) => ({
                    width: instance.width,
                    height: instance.height,
                  }))
                : new Promise<HTMLVideoElement>((resolve) => {
                    const instance = document.createElement('video');

                    instance.src = data;

                    instance.addEventListener('loadedmetadata', () => {
                      resolve(instance);
                    });
                  }).then((instance) => ({
                    width: instance.videoWidth,
                    height: instance.videoHeight,
                  }));

            return size.then(({ width, height }) =>
              putString(ref, data, firebase.storage.StringFormat.DATA_URL, {
                customMetadata: {
                  width: width.toString(),
                  height: height.toString(),
                },
              }).toPromise(),
            );
          })
          .then(({ ref }) => {
            setStatus('success');

            queueSnackbar({
              severity: 'success',
              message: `"${file.name}" uploaded`,
            });

            return { path: ref.fullPath, width: 0, height: 0 };
          });
      }),
    ).catch((error: Error) => {
      setStatus('failure');

      queueSnackbar({ severity: 'error', message: error.message });

      return [] as StorageFile[];
    });
  };

  return { upload, status };
};
