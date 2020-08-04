import useTheme from '@material-ui/core/styles/useTheme';
import { SnackbarContext } from 'context';
import React from 'react';
import ReactJoyride, { CallBackProps, Styles } from 'react-joyride';
import { useLocalStorageSet, useLocalStorageSubscribe } from 'services';
import { headerZIndex } from 'styles';

export const Tour: React.FC<Pick<
  React.ComponentProps<typeof ReactJoyride>,
  'steps'
>> = ({ steps }) => {
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
          message: "Now it's your turn. Fingers crossed 🍀",
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
        run={shouldRunTour === null || !!shouldRunTour}
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
