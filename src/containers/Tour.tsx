import { useTheme } from '@material-ui/core';
import React from 'react';
import ReactJoyride, { CallBackProps, Styles } from 'react-joyride';
import { headerZIndex } from 'styles';

export const Tour: React.FC<Pick<
  React.ComponentProps<typeof ReactJoyride>,
  'steps'
>> = ({ steps }) => {
  const [shouldRunTour, setShouldRunTour] = React.useState(false);

  const theme = useTheme();

  React.useEffect(() => {
    const shouldRunString = localStorage.getItem('shouldRunTour');
    const shouldRun = shouldRunString ? JSON.parse(shouldRunString) : true;

    if (shouldRun) {
      setShouldRunTour(shouldRun);
    }
  }, []);

  const handleTourRan = React.useCallback(({ action }: CallBackProps) => {
    if (action === 'skip' || action === 'stop') {
      setShouldRunTour(false);
      localStorage.setItem('shouldRunTour', false.toString());
    }
  }, []);

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
  );
};
