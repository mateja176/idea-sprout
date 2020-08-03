import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Info } from '@material-ui/icons';
import { useBoolean } from 'ahooks';
import { CheckProps } from 'models';
import React from 'react';

export const Check: React.FC<CheckProps> = ({
  label,
  description,
  checked,
  onChange,
  name,
  onBlur,
  errorMessage,
  disabled,
  height = 'auto',
}) => {
  const [isDialogOpen, setIsDialogOpen] = useBoolean();

  const hasError = !!errorMessage;

  const formControlStyle: React.CSSProperties = { height, display: 'block' };

  const handleInfoClick: React.MouseEventHandler = React.useCallback(
    (e) => {
      e.stopPropagation();
      setIsDialogOpen.setTrue();
    },
    [setIsDialogOpen],
  );

  return (
    <FormControl disabled={disabled} error={hasError} style={formControlStyle}>
      <FormControlLabel
        label={
          <Box display="flex" alignItems="center">
            <Typography>{label}</Typography>
            <Tooltip title={disabled ? '' : 'Opens dialog with more info'}>
              <IconButton
                disabled={disabled}
                onClick={handleInfoClick}
                color="primary"
              >
                <Info />
              </IconButton>
            </Tooltip>
            <Dialog onClose={setIsDialogOpen.setFalse} open={isDialogOpen}>
              <DialogTitle>{label}</DialogTitle>
              <DialogContent>
                <DialogContentText>{description}</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={setIsDialogOpen.setFalse}>Clear</Button>
              </DialogActions>
            </Dialog>
          </Box>
        }
        control={
          <Checkbox
            name={name}
            checked={checked}
            onChange={onChange}
            onBlur={onBlur}
          />
        }
      />
      {errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
    </FormControl>
  );
};
