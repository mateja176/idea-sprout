import {
  Box,
  CircularProgress,
  DialogContent,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  makeStyles,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import { useBoolean } from 'ahooks';
import { proMembership, proMembershipDiscount } from 'elements';
import { Order, User, WithPaypal } from 'models';
import React from 'react';
import { createQueueSnackbar, Email, env, useActions } from 'services';
import { paypalButtonsHeight, paypalHeightBreakpoint } from 'styles';

const id = 'paypal-container';

const scriptId = 'paypal-script';

const useStyles = makeStyles((theme) => ({
  paypalButtonsHeight: {
    display: 'flex',
    justifyContent: 'center',
    height: paypalButtonsHeight[116],
    [theme.breakpoints.up(paypalHeightBreakpoint[400])]: {
      height: paypalButtonsHeight[142],
    },
    [theme.breakpoints.up(paypalHeightBreakpoint[600])]: {
      height: paypalButtonsHeight[168],
    },
  },
}));

export const ExportReviewsContent: React.FC<
  Pick<User, 'email'> & { onClose: () => void }
> = ({ email, onClose }) => {
  const { queueSnackbar } = useActions({ queueSnackbar: createQueueSnackbar });

  const classes = useStyles();

  const [sendingEmail, setSendingEmail] = useBoolean();

  const sendEmail = React.useCallback(
    (order: Order) => {
      setSendingEmail.setTrue();
      return Email.send({
        Host: env.smtpHost,
        Username: env.smtpUsername,
        Password: env.smtpPassword,
        To: env.smtpTo,
        From: env.smtpFrom,
        Subject: 'Pro Membership Order',
        Body: `- Order placed by: ${email}
- Order id is: ${order.id}`,
      }).then(() => {
        setSendingEmail.setFalse();

        onClose();

        queueSnackbar({
          severity: 'success',
          message:
            "You'll receive an email, up to 12 hours from now, stating that your membership is active",
          autoHideDuration: 10000,
        });
      });
    },
    [email, queueSnackbar, onClose, setSendingEmail],
  );

  const [scriptLoading, setScriptLoading] = useBoolean();

  const renderButtons = React.useCallback(
    () =>
      ((window as unknown) as WithPaypal).paypal
        ?.Buttons({
          createOrder: (_, actions) =>
            actions.order.create({
              purchase_units: [
                {
                  description: 'Pro membership',
                  amount: {
                    value: proMembershipDiscount.amount.value,
                  },
                },
              ],
            }),
          onApprove: (_, actions) => actions.order.capture().then(sendEmail),
        })
        .render(`#${id}`),
    [sendEmail],
  );

  React.useEffect(() => {
    if (document.getElementById(scriptId)) {
      renderButtons();
    } else {
      setScriptLoading.setTrue();

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${env.paypalClientId}`;
      script.id = scriptId;

      script.addEventListener('load', () => {
        renderButtons();

        setScriptLoading.setFalse();
      });

      document.body.appendChild(script);
    }
  }, [sendEmail, renderButtons, setScriptLoading]);

  return (
    <DialogContent style={{ overflowY: 'scroll' }}>
      <Box textAlign={'justify'} position={'relative'}>
        {sendingEmail && (
          <Box
            position={'absolute'}
            display={'flex'}
            width={'100%'}
            justifyContent={'center'}
            height={'100%'}
            alignItems={'center'}
          >
            <CircularProgress />
          </Box>
        )}
        <Box visibility={sendingEmail ? 'hidden' : 'visible'}>
          <Box>
            {proMembership.proposition}
            <br />
            {proMembershipDiscount.proposition}
            <br />
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                Important note
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                {proMembership.info}
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Box>
          <br />
          <div id={id} className={classes.paypalButtonsHeight}>
            {scriptLoading && (
              <Skeleton width={'100%'} height={'100%'} variant={'rect'} />
            )}
          </div>
        </Box>
      </Box>
    </DialogContent>
  );
};
