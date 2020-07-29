import { useTheme } from '@material-ui/core';
import React from 'react';
import ReactJoyride, { CallBackProps, Styles } from 'react-joyride';
import { createQueueSnackbar, useActions, useLocalStorage } from 'services';
import { headerZIndex } from 'styles';

export const Tour: React.FC<Pick<
  React.ComponentProps<typeof ReactJoyride>,
  'steps'
>> = ({ steps }) => {
  const { queueSnackbar } = useActions({ queueSnackbar: createQueueSnackbar });

  const localStorage = useLocalStorage();

  const [shouldRunTour, setShouldRunTour] = React.useState(false);

  const theme = useTheme();

  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const unsubscribe = localStorage.subscribe(
      'shouldRunTour',
      (action, value) => {
        console.log('sub', action, value);
        if (action === 'set' || action === 'initial') {
          setShouldRunTour(!!value);
        }
      },
    );

    return unsubscribe;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTourRan = React.useCallback(
    (props: CallBackProps) => {
      const { action } = props;
      if (action === 'close' || action === 'reset') {
        ref.current?.parentElement?.scrollTo({ top: 0, behavior: 'smooth' });
        localStorage.setItem('shouldRunTour', false);

        queueSnackbar({
          severity: 'success',
          message: "Now it's your turn. Fingers crossed 🍀",
        });
      }
    },
    [queueSnackbar, localStorage],
  );

  const styles: Styles = React.useMemo(
    () => ({
      beacon: {
        display: 'none',
      },
      options: {
        zIndex: headerZIndex,
      },
      buttonNext: {
        background: theme.palette.primary.main,
      },
      buttonBack: {
        background: theme.palette.secondary.main,
        color: 'white',
      },
    }),
    [theme],
  );

  return (
    <div ref={ref}>
      <ReactJoyride
        steps={steps}
        run={shouldRunTour}
        continuous
        showProgress
        showSkipButton
        disableOverlayClose
        spotlightPadding={0}
        styles={styles}
        callback={handleTourRan}
      />
    </div>
  );
};
