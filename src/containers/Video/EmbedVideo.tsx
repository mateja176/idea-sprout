import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  ButtonProps,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { useBoolean } from 'ahooks';
import { useFormik } from 'formik';
import { StorageFile } from 'models';
import qs from 'qs';
import React from 'react';
import {
  createQueueSnackbar,
  useActions,
  useLoadYoutubeScript,
  useRenderPlayer,
} from 'services';
import { inputStyle } from 'styles';
import * as yup from 'yup';
import { Link } from '@material-ui/icons';

const type = 'video';

const initialValues = {
  link: '',
};
type Values = typeof initialValues;
const validationSchema = yup
  .object()
  .required()
  .shape<Values>({ link: yup.string().required().url() });

export const EmbedVideo: React.FC<
  {
    update: (file: StorageFile) => Promise<void>;
    label?: string;
  } & ButtonProps
> = ({ update, style, label, ...props }) => {
  const { queueSnackbar } = useActions({ queueSnackbar: createQueueSnackbar });

  const { renderPlayer, videoLoading, playerId } = useRenderPlayer();

  const { loadScript } = useLoadYoutubeScript();

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
        <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
          <form onSubmit={handleSubmit}>
            <TextField
              {...getFieldProps('link')}
              label={`Link to ${type}`}
              error={!!errors.link}
              helperText={(touched.link || '') && errors.link}
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
            {videoLoading && (
              <Skeleton variant={'rect'} width={'100%'} height={'100%'} />
            )}
            <div ref={wrapperRef}>
              <div id={playerId} />
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
