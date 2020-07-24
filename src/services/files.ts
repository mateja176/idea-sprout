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
        reject(new Error('Video may only be up to 3 minutes long'));
      }
      resolve(instance);
    });
  }).then((instance) => ({
    width: instance.videoWidth,
    height: instance.videoHeight,
  }));
