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
import { GetCheckFieldProps } from 'models';
import React from 'react';

export interface CheckProps {
  name: string;
  label: string;
  description: React.ReactNode;
  getFieldProps: GetCheckFieldProps;
  errorMessage?: string;
}

const formControlStyle: React.CSSProperties = { height: 64, display: 'block' };

export const Check: React.FC<CheckProps> = ({
  name,
  label,
  description,
  getFieldProps,
  errorMessage,
}) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const toggleIsDialogOpen = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const fieldProps = getFieldProps(name);

  const hasError = !!errorMessage;

  return (
    <FormControl error={hasError} style={formControlStyle}>
      <FormControlLabel
        label={
          <Box display="flex" alignItems="center">
            <Typography>{label}</Typography>
            <Tooltip title="Opens dialog with more info">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  toggleIsDialogOpen();
                }}
              >
                <Info color="primary" />
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
        control={<Checkbox {...fieldProps} checked={fieldProps.value} />}
      />
      {errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
    </FormControl>
  );
};
