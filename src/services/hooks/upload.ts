import { useBoolean } from 'ahooks';
import firebase from 'firebase/app';
import { StorageFile, StoragePath } from 'models';
import { useStorage } from 'reactfire';
import {
  getFileData,
  getImageDimensions,
  getVideoDimensionsAndValidate,
} from 'services';
import urljoin from 'url-join';
import { useSignedInUser } from './firebase';

export const useUpload = (path: StoragePath) => {
  const user = useSignedInUser();

  const [loading, setLoading] = useBoolean();

  const storage = useStorage();

  const upload = (files: File[]): Promise<StorageFile[]> => {
    setLoading.setTrue();

    return Promise.all(
      files.map((file) => {
        const { name } = file;

        const ref = storage.ref(urljoin(path, user.uid, name));

        return getFileData(file).then((data) => {
          const size =
            path === 'images'
              ? getImageDimensions(data)
              : getVideoDimensionsAndValidate(data);

          return size.then(({ width, height }) =>
            ref
              .putString(data, firebase.storage.StringFormat.DATA_URL, {
                cacheControl: 'public, max-age=300',
                customMetadata: {
                  width: width.toString(),
                  height: height.toString(),
                },
              })
              .then(() => ({
                path: ref.fullPath,
                width,
                height,
              })),
          );
        });
      }),
    ).finally(() => {
      setLoading.setFalse();
    });
  };

  return { upload, loading };
};
