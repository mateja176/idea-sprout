import useTheme from '@material-ui/core/styles/useTheme';
import React from 'react';
import ReactJoyride, { CallBackProps, Styles } from 'react-joyride';
import { SnackbarContext } from '../context/snackbar';
import { useLocalStorageSet, useLocalStorageSubscribe } from '../hooks/hooks';
import { headerZIndex } from '../utils/styles/styles';

export const Tour: React.FC<Pick<
  React.ComponentProps<typeof ReactJoyride>,
  'steps' | 'run'
>> = ({ steps, run }) => {
  const { queueSnackbar } = React.useContext(SnackbarContext);

  const shouldRunTour = useLocalStorageSubscribe('shouldRunTour');
  const setShouldTourRun = useLocalStorageSet('shouldRunTour');

  const theme = useTheme();

  const ref = React.useRef<HTMLDivElement | null>(null);

  const handleTourRan = React.useCallback(
    (props: CallBackProps) => {
      const { action } = props;
      if (action === 'close' || action === 'reset') {
        ref.current?.parentElement?.scrollTo({ top: 0, behavior: 'smooth' });
        setShouldTourRun(false);

        queueSnackbar({
          severity: 'success',
          message: 'Congrats on finishing the tour!',
        });
      }
    },
    [queueSnackbar, setShouldTourRun],
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
        run={(shouldRunTour === null || !!shouldRunTour) && run}
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
