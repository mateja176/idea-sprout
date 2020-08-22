import Box from '@material-ui/core/Box';
import React from 'react';
import { WithValue } from '../models/upgrade';

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
      The pro membership lasts for one month unless you renew it during the
      following <strong>30 days</strong>. If you have any questions or concerns,
      feel free to send a message in the chat or write us an email at{' '}
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
      This is a <strong>limited offer</strong> to celebrate the{' '}
      <strong>launch</strong>.
    </Box>
  ),
  info: proMembershipInfo,
};
