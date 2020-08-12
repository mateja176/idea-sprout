export const getFileData = (file: File) => {
  const reader = new FileReader();

  reader.readAsDataURL(file);

  return new Promise<string>((resolve) => {
    reader.onload = () => {
      resolve(String(reader.result));
    };
  });
};

export const getImageDimensions = (data: string) =>
  new Promise<HTMLImageElement>((resolve) => {
    const instance = new Image();

    instance.src = data;

    instance.addEventListener('load', () => {
      resolve(instance);
    });
  }).then((instance) => ({
    width: instance.width,
    height: instance.height,
  }));

export const getVideoDimensionsAndValidate = (data: string) =>
  new Promise<HTMLVideoElement>((resolve, reject) => {
    const instance = document.createElement('video');

    instance.src = data;

    instance.addEventListener('loadedmetadata', () => {
      if (instance.duration > 180) {
        reject(
          new Error(
            'For videos longer than 3 minutes, use YouTube embed option.',
          ),
        );
      }
      resolve(instance);
    });
  }).then((instance) => ({
    width: instance.videoWidth,
    height: instance.videoHeight,
  }));

export const exportFile = ({
  name,
  content,
}: {
  name: string;
  content: string;
}) => {
  const blob = new Blob([content], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = name;

  document.body.appendChild(a);

  a.click();

  URL.revokeObjectURL(url);
  a.remove();
};
