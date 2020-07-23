import { Box } from '@material-ui/core';
import { WithValue } from 'models';
import React from 'react';

export interface Product {
  amount: WithValue;
  proposition: React.ReactNode;
  info: React.ReactNode;
}

const proMembershipProposition = (
  <Box>
    Having access to reviews is extremely powerful as you are able to build a{' '}
    <strong>mailing list</strong> about users who reviewed your idea.
    Additionally, you're able to use the{' '}
    <strong>reviews as testimonials</strong> on your website.
  </Box>
);
const proMembershipInfo = (
  <Box>
    <Box>
      Bear in mind that, because of the <i>high demand</i>, the activation of
      your pro membership may last <i>up to 12 hours</i>. You will be notified
      promptly when your membership is activated. After you receive the email,
      in order for your newly found privileges to take effect immediately, it is
      required to <i>sign out and sign in again</i>, after which you can use the
      app to its full extent.
    </Box>
    <br />
    <Box>
      The pro membership lasts for one month unless you renew it during the
      following <i>30 days</i>. If you have any questions or concerns, feel free
      to contact us directly by writing an email to{' '}
      <i>startupideasprout@gmail.com</i>
    </Box>
  </Box>
);

export const proMembership: Product = {
  amount: {
    value: 19.99,
  },
  proposition: proMembershipProposition,
  info: proMembershipInfo,
};

export const proMembershipDiscount: Product = {
  amount: {
    value: 9.99,
  },
  proposition: (
    <Box>
      This is a <i>limited offer</i> to celebrate the launch.
    </Box>
  ),
  info: proMembershipInfo,
};
