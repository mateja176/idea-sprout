import Box from '@material-ui/core/Box';
import Button, { ButtonProps } from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/icons/Link';
import Skeleton from '@material-ui/lab/Skeleton';
import useBoolean from 'ahooks/es/useBoolean';
import { SnackbarContext } from 'context/snackbar';
import { useFormik } from 'formik';
import { StorageFile } from 'models';
import qs from 'qs';
import React from 'react';
import { useLoadYoutubeScript, useRenderPlayer } from 'services/hooks';
import { inputStyle, mediaBgGreyVariant } from 'styles/styles';
import * as yup from 'yup';

const type = 'video';

const dialogContentStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

const initialValues = {
  link: '',
};
type Values = typeof initialValues;
const validationSchema = yup
  .object()
  .required()
  .shape<Values>({ link: yup.string().required().url() });

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    background: theme.palette.grey[mediaBgGreyVariant],
    height: ({ height }: Required<Pick<React.CSSProperties, 'height'>>) =>
      height,
  },
}));

export const EmbedVideo: React.FC<
  {
    update: (file: StorageFile) => Promise<void>;
    label?: string;
  } & ButtonProps
> = ({ update, style, label, ...props }) => {
  const { queueSnackbar } = React.useContext(SnackbarContext);

  const { renderPlayer, playerId } = useRenderPlayer();

  const { loadScript } = useLoadYoutubeScript();

  const [wrapperHeight, setWrapperHeight] = React.useState<
    NonNullable<React.CSSProperties['height']>
  >('auto');

  const classes = useStyles({ height: wrapperHeight });

  const [embedDialogOpen, setEmbedDialogOpen] = useBoolean();

  const wrapperRef = React.useRef<HTMLDivElement | null>(null);

  const [videoId, setVideoId] = React.useState('');

  const handleEntered = React.useCallback(() => {
    loadScript();
  }, [loadScript]);

  const handleEmbed: React.MouseEventHandler = React.useCallback(() => {
    if (wrapperRef.current && wrapperRef.current.firstElementChild) {
      update({
        path: videoId,
        width: wrapperRef.current.firstElementChild.clientWidth,
        height: wrapperRef.current.firstElementChild.clientHeight,
      });
    }

    setEmbedDialogOpen.setFalse();
  }, [update, videoId, setEmbedDialogOpen]);

  const { errors, touched, getFieldProps, handleSubmit, isValid } = useFormik({
    initialValues,
    onSubmit: (values) => {
      const maybeVideoId = qs.parse(values.link.split('?')?.[1] ?? '').v as
        | string
        | undefined;
      if (maybeVideoId) {
        setVideoId(maybeVideoId);

        renderPlayer({
          videoId: maybeVideoId,
          onReady: () => {
            if (wrapperRef.current?.firstElementChild) {
              setWrapperHeight(
                wrapperRef.current.firstElementChild.clientHeight,
              );
            }
          },
        });
      } else {
        queueSnackbar({
          severity: 'error',
          message:
            "Any video link taken from youtube.com contains a video id and this one doesn't",
        });
      }
    },
    validationSchema,
  });

  const linkHelperText = React.useMemo(
    () => (touched.link || '') && errors.link,
    [touched, errors],
  );

  return (
    <>
      {label ? (
        <Button
          style={style}
          onClick={setEmbedDialogOpen.setTrue}
          startIcon={<Link />}
          {...props}
        >
          {label}
        </Button>
      ) : (
        <Button style={style} onClick={setEmbedDialogOpen.setTrue} {...props}>
          <Link />
        </Button>
      )}
      <Dialog
        fullScreen
        open={embedDialogOpen}
        onClose={setEmbedDialogOpen.setFalse}
        onEntered={handleEntered}
      >
        <DialogTitle>Embed {type}</DialogTitle>
        <DialogContent style={dialogContentStyle}>
          <form onSubmit={handleSubmit}>
            <TextField
              {...getFieldProps('link')}
              label={`Link to ${type}`}
              error={!!errors.link}
              helperText={linkHelperText}
              style={inputStyle}
            />
            <Box mt={1}>
              <Button
                color={'primary'}
                variant={'contained'}
                type="submit"
                disabled={!isValid}
              >
                Preview
              </Button>
            </Box>
          </form>
          <Box
            my={5}
            flex={1}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <div ref={wrapperRef} className={classes.wrapper}>
              <div id={playerId}>
                <Skeleton variant={'rect'} width={'100%'} height={'100%'} />
              </div>
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={setEmbedDialogOpen.setFalse}>Close</Button>
          <Button
            disabled={!videoId}
            color={'primary'}
            variant={'contained'}
            onClick={handleEmbed}
          >
            Embed
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
