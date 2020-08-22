import { isNil } from 'ramda';

export function assertRequired<O extends {}>(
  object: O,
): asserts object is Required<O> {
  Object.entries(object).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      assertRequired(value);
    }
    if (isNil(value)) {
      throw new Error(`Key ${key} is required, but the provided value is nil`);
    }
  });
}

export const blur = () => {
  (globalThis.document.activeElement as HTMLInputElement)?.blur();
};

export const getOrigin = () => globalThis.location.origin;

interface MetaTagValues {
  image: string;
  url: string;
  title: string;
  description: string;
}

type MaybeMetaTagValues = {
  [key in keyof MetaTagValues]: string | null | undefined;
};

export const getMetaTags = () => ({
  title: globalThis.document.querySelector('title'),
  favicon: globalThis.document.querySelector('link[rel="icon"]'),
  metaTwitterImage: globalThis.document.querySelector(
    'meta[name="twitter:image"]',
  ),
  metaImage: globalThis.document.querySelector('meta[property="og:image"]'),
  metaURL: globalThis.document.querySelector('meta[property="og:url"]'),
  metaTitle: globalThis.document.querySelector('meta[property="og:title"]'),
  metaDescription: globalThis.document.querySelector(
    'meta[property="og:description"]',
  ),
});

export const saveMetaTagValues = (): MaybeMetaTagValues => {
  const metaTags = getMetaTags();

  return {
    title: metaTags.title?.innerHTML,
    image: metaTags.metaImage?.getAttribute('content'),
    url: metaTags.metaURL?.getAttribute('content'),
    description: metaTags.metaDescription?.getAttribute('content'),
  };
};

export const setMetaTagValues = (values: MaybeMetaTagValues) => {
  const { title, image, url, description } = values;

  const metaTags = getMetaTags();

  if (metaTags.title && title) {
    metaTags.title.innerHTML = title;
  }
  if (image) {
    metaTags.favicon?.setAttribute('href', image);
  }
  if (image) {
    metaTags.metaTwitterImage?.setAttribute('content', image);
  }
  if (image) {
    metaTags.metaImage?.setAttribute('content', image);
  }
  if (url) {
    metaTags.metaURL?.setAttribute('content', url);
  }
  if (title) {
    metaTags.metaTitle?.setAttribute('content', title);
  }
  if (description) {
    metaTags.metaDescription?.setAttribute('content', description);
  }
};
