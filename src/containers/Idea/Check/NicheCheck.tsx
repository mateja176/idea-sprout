import Box from '@material-ui/core/Box';
import { Check } from 'containers/Check';
import { CheckProps } from 'models';
import React from 'react';

export interface NicheCheckProps
  extends Pick<CheckProps, 'checked' | 'onChange'> {}

export const NicheCheck: React.FC<NicheCheckProps> = ({
  checked,
  onChange,
}) => (
  <Check
    label="Choose a niche"
    description={
      <Box>
        <Box>
          Almost every product has a potential to reach the mass market and
          become a household name. However, almost no product reached mass
          market adoption out of the box, since there are only so many Aspirins
          to be in the world.
        </Box>
        <Box>
          Take the example of Tesla Motors, everybody can and perhaps should
          drive an electric car, but around 2008, there was almost no interest
          in electric vehicles among the public. Tesla had a vision, however
          they also had a gap to bridge. Hence they decided to launch the Tesla
          Roadster, an attractive all electric sports car. This attracted
          celebrities and sport car enthusiasts alike, which had the added
          benefit of putting the company in the public limelight which
          ultimately enabled them to sway peoples opinion on how cool electric
          cars can be.
        </Box>
        <Box>
          And nowadays with the Model 3, they are on the brink on producing an
          electric car for the masses.
        </Box>
      </Box>
    }
    checked={checked}
    onChange={onChange}
  />
);
