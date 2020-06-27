import { useBoolean } from 'ahooks';
import firebase from 'firebase/app';
import 'firebase/storage';
import { StorageFile, StoragePath } from 'models';
import { useStorage } from 'reactfire';
import { putString } from 'rxfire/storage';
import { createQueueSnackbar } from 'services/store';
import urljoin from 'url-join';
import { useSignedInUser } from './firebase';
import { useActions } from './hooks';

export const useUpload = (path: StoragePath) => {
  const { queueSnackbar } = useActions({
    queueSnackbar: createQueueSnackbar,
  });

  const user = useSignedInUser();

  const [loading, setLoading] = useBoolean();

  const storage = useStorage();

  const upload = (files: File[]): Promise<StorageFile[]> => {
    setLoading.setTrue();

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
              })
                .toPromise()
                .then(() => ({
                  path: ref.fullPath,
                  width,
                  height,
                })),
            );
          })
          .then(({ path, width, height }) => {
            queueSnackbar({
              severity: 'success',
              message: `"${file.name}" uploaded`,
            });

            return { path, width, height };
          });
      }),
    )
      .catch((error: Error) => {
        queueSnackbar({ severity: 'error', message: error.message });

        return [] as StorageFile[];
      })
      .finally(() => {
        setLoading.setFalse();
      });
  };

  return { upload, loading };
};
