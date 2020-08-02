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
      As a security measure, you will be prompted to enter your password if you
      signed up with an email or password. Otherwise you will be asked to
      reauthenticate with Google, Facebook or Twitter.
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
