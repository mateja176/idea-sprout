import React from 'react';
import { useStorage } from 'reactfire';
import { useStorageDownloadUrl } from '../../hooks/firebase';
import { useIdeaUrl } from '../../hooks/idea';
import { IdeaModel } from '../../models/idea';
import { saveMetaTagValues, setMetaTagValues } from '../../services/services';

const IdeaMetaTags: React.FC<{ idea: IdeaModel }> = ({ idea }) => {
  const url = useIdeaUrl(idea.id);

  const storage = useStorage();

  const logoFullUrl = useStorageDownloadUrl(storage.ref(idea.logo.path));

  React.useEffect(() => {
    const metaTagValues = saveMetaTagValues();

    const logoUrl = new URL(logoFullUrl);

    logoUrl.searchParams.delete('token');

    setMetaTagValues({
      title: idea.name,
      url,
      description: idea.tagline,
      image: logoUrl.href,
    });

    return () => {
      setMetaTagValues(metaTagValues);
    };
  }, [idea, logoFullUrl, url]);

  return null;
};

export default (props: React.ComponentProps<typeof IdeaMetaTags>) => (
  <React.Suspense fallback={null}>
    <IdeaMetaTags {...props} />
  </React.Suspense>
);
