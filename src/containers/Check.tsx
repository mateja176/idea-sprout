import {
  Box,
  Button,
  Checkbox,
  CheckboxProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormControlProps,
  FormHelperText,
  IconButton,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Info } from '@material-ui/icons';
import React from 'react';

export interface CheckProps
  extends Pick<FormControlProps, 'disabled'>,
    Pick<CheckboxProps, 'checked' | 'onChange' | 'name' | 'onBlur'>,
    Pick<React.CSSProperties, 'height'> {
  label: string;
  description: React.ReactNode;
  errorMessage?: string;
}

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
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const toggleIsDialogOpen = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const hasError = !!errorMessage;

  const formControlStyle: React.CSSProperties = { height, display: 'block' };

  return (
    <FormControl disabled={disabled} error={hasError} style={formControlStyle}>
      <FormControlLabel
        label={
          <Box display="flex" alignItems="center">
            <Typography>{label}</Typography>
            <Tooltip title={disabled ? '' : 'Opens dialog with more info'}>
              <IconButton
                disabled={disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleIsDialogOpen();
                }}
                color="primary"
              >
                <Info />
              </IconButton>
            </Tooltip>
            <Dialog onClose={toggleIsDialogOpen} open={isDialogOpen}>
              <DialogTitle>{label}</DialogTitle>
              <DialogContent>
                <DialogContentText>{description}</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={toggleIsDialogOpen}>Clear</Button>
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
