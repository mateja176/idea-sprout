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

export const getVideoDimensions = (data: string) =>
  new Promise<HTMLVideoElement>((resolve) => {
    const instance = document.createElement('video');

    instance.src = data;

    instance.addEventListener('loadedmetadata', () => {
      resolve(instance);
    });
  }).then((instance) => ({
    width: instance.videoWidth,
    height: instance.videoHeight,
  }));
