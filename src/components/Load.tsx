import Box from '@material-ui/core/Box';
import Skeleton, { SkeletonProps } from '@material-ui/lab/Skeleton';
import React from 'react';

export interface LoaderProps extends SkeletonProps {
  boxFlex?: React.CSSProperties['flex'];
}

export const Load: React.FC<LoaderProps> = ({
  boxFlex,
  children,
  ...props
}) => {
  const style: React.CSSProperties = React.useMemo(
    () => ({ position: 'absolute', ...props.style }),
    [props.style],
  );

  return (
    <Box position="relative" display={'inline-block'} flex={boxFlex}>
      <Skeleton
        variant="rect"
        width={'100%'}
        height={'100%'}
        {...props}
        style={style}
      />
      <Box visibility={'hidden'}>{children}</Box>
    </Box>
  );
};
