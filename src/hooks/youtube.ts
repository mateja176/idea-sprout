import useBoolean from 'ahooks/es/useBoolean';
import { SnackbarContext } from 'context/snackbar';
import { useCallback, useContext, useMemo } from 'react';
import { renderPlayerService } from 'services/youtube';
import { Player } from 'types/youtube';
import { v4 } from 'uuid';

const API = 'https://www.youtube.com/iframe_api';

const scriptId = 'youtube-iframe-script';

export const useRenderPlayer = (options?: Partial<Player['options']>) => {
  const { queueSnackbar } = useContext(SnackbarContext);

  const [videoLoading, setVideoLoading] = useBoolean();

  const playerId = useMemo(() => v4(), []);

  const renderPlayer = useCallback(
    ({ videoId, onReady }: { videoId: string; onReady?: () => void }) => {
      setVideoLoading.setTrue();

      return renderPlayerService({ playerId, videoId, ...options })
        .then(() => {
          setVideoLoading.setFalse();

          if (onReady) {
            onReady();
          }
        })
        .catch((e: Error) => {
          queueSnackbar({ severity: 'error', message: e.message });
        });
    },
    [setVideoLoading, queueSnackbar, playerId, options],
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
      if (document.getElementById(scriptId)) {
        if (onLoad) {
          onLoad();
        }
      } else {
        setScriptLoading.setTrue();
        const script = document.createElement('script');

        script.id = scriptId;

        script.src = API;

        script.addEventListener('load', () => {
          window.YT?.ready(() => {
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
