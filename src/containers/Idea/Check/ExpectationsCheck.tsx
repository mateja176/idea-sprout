import Box from '@material-ui/core/Box';
import { Check } from 'containers';
import { CheckProps } from 'models';
import React from 'react';

export interface ExpectationsCheckProps
  extends Pick<CheckProps, 'checked' | 'onChange'> {}

export const ExpectationsCheck: React.FC<ExpectationsCheckProps> = ({
  checked,
  onChange,
}) => (
  <Check
    label="Set expectations"
    description={
      <Box>
        <Box>
          Setting up high expectations can sometimes increase motivation and
          interest for a product, however setting the bar up too high can have
          the opposite effect.
        </Box>
        <Box>
          It's possible for your to get manufacturing costs down significantly
          after having scaled your company, however, it takes time to get up to
          scale and process is gradual with ups and downs.
        </Box>
        <Box>
          Establishing trust with your early adopters by cherishing transparency
          and honesty can bring you a long way. Hence, be realistic of what you
          can offer to users in this period of time.
        </Box>
      </Box>
    }
    checked={checked}
    onChange={onChange}
    disabled={false}
  />
);
