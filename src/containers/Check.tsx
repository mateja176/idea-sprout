import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Info from '@material-ui/icons/Info';
import { useBoolean } from 'ahooks';
import React from 'react';
import { CheckProps } from '../models/idea';

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
