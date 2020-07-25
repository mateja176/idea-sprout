import { useBoolean } from 'ahooks';
import { useCallback, useMemo } from 'react';
import { v4 } from 'uuid';
import { createQueueSnackbar } from 'services/store';
import { useActions } from './hooks';

const API = 'https://www.youtube.com/iframe_api';

const scriptId = 'youtube-iframe-script';

export const useRenderPlayer = () => {
  const { queueSnackbar } = useActions({ queueSnackbar: createQueueSnackbar });

  const [videoLoading, setVideoLoading] = useBoolean();

  const playerId = useMemo(() => v4(), []);

  const renderPlayer = useCallback(
    ({ videoId }: { videoId: string }) => {
      setVideoLoading.setTrue();

      try {
        new (window as any).YT.Player(playerId, {
          videoId,
          events: {
            onReady: () => {
              setVideoLoading.setFalse();
            },
          },
        });
      } catch (e) {
        queueSnackbar({ severity: 'error', message: e.message });
      }
    },
    [setVideoLoading, queueSnackbar, playerId],
  );

  return {
    videoLoading,
    renderPlayer,
    playerId,
  };
};

export const useLoadYoutubeScript = () => {
  const [scriptLoading, setScriptLoading] = useBoolean();

  const loadScript = useCallback(
    (onLoad?: () => void) => {
      if (!document.getElementById(scriptId)) {
        setScriptLoading.setTrue();
        const script = document.createElement('script');

        script.id = scriptId;

        script.src = API;

        script.addEventListener('load', () => {
          (window as any).YT.ready(() => {
            if (onLoad) {
              onLoad();
            }
          });

          setScriptLoading.setFalse();
        });

        document.body.appendChild(script);
      }
    },
    [setScriptLoading],
  );

  return { loadScript, scriptLoading };
};
