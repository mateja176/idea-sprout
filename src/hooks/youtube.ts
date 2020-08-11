import useBoolean from 'ahooks/es/useBoolean';
import { SnackbarContext } from 'context/snackbar';
import { useCallback, useContext, useMemo } from 'react';
import { loadScriptService, renderPlayerService } from 'services/youtube';
import { Player } from 'types/youtube';
import { v4 } from 'uuid';

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
      setScriptLoading.setTrue();

      return loadScriptService().then(() => {
        if (onLoad) {
          onLoad();
        }

        setScriptLoading.setFalse();
      });
    },
    [setScriptLoading],
  );

  return { loadScript, scriptLoading };
};
