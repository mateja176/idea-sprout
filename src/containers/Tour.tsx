import { useTheme } from '@material-ui/core';
import React from 'react';
import ReactJoyride, { CallBackProps, Styles } from 'react-joyride';
import { createQueueSnackbar, useActions } from 'services';
import { headerZIndex } from 'styles';

export const Tour: React.FC<Pick<
  React.ComponentProps<typeof ReactJoyride>,
  'steps'
>> = ({ steps }) => {
  const { queueSnackbar } = useActions({ queueSnackbar: createQueueSnackbar });

  const [shouldRunTour, setShouldRunTour] = React.useState(false);

  const theme = useTheme();

  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const shouldRunString = localStorage.getItem('shouldRunTour');
    const shouldRun = shouldRunString ? JSON.parse(shouldRunString) : true;

    if (shouldRun) {
      setShouldRunTour(shouldRun);
    }
  }, []);

  const handleTourRan = React.useCallback(
    (props: CallBackProps) => {
      const { action } = props;
      if (action === 'close' || action === 'reset') {
        ref.current?.parentElement?.scrollTo({ top: 0, behavior: 'smooth' });
        setShouldRunTour(false);
        localStorage.setItem('shouldRunTour', false.toString());

        queueSnackbar({
          severity: 'success',
          message: "Now it's your turn. Fingers crossed 🍀",
        });
      }
    },
    [queueSnackbar],
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
