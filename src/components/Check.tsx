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
  Typography,
} from '@material-ui/core';
import { Info } from '@material-ui/icons';
import { FieldInputProps } from 'formik';
import React from 'react';

export interface CheckProps {
  name: string;
  label: string;
  description: React.ReactNode;
  getFieldProps: (name: string) => FieldInputProps<boolean>;
  hasError: boolean;
  errorMessage?: string;
}

const formControlStyle: React.CSSProperties = { height: 64, display: 'block' };

export const Check: React.FC<CheckProps> = ({
  name,
  label,
  description,
  getFieldProps,
  hasError,
  errorMessage,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const toggleIsModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  };

  const fieldProps = getFieldProps(name);

  return (
    <FormControl error={hasError} style={formControlStyle}>
      <FormControlLabel
        label={
          <Box display="flex" alignItems="center">
            <Typography>{label}</Typography>
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                toggleIsModalOpen();
              }}
            >
              <Info color="primary" />
            </IconButton>
            <Dialog onClose={toggleIsModalOpen} open={isModalOpen}>
              <DialogTitle>{label}</DialogTitle>
              <DialogContent>
                <DialogContentText>{description}</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={toggleIsModalOpen}>Clear</Button>
              </DialogActions>
            </Dialog>
          </Box>
        }
        control={<Checkbox {...fieldProps} checked={fieldProps.value} />}
      />
      {hasError && <FormHelperText>{errorMessage}</FormHelperText>}
    </FormControl>
  );
};
