import Typography from '@material-ui/core/Typography';
import { headingIds } from 'models/idea';
import React from 'react';

export const nameTitle = (
  <Typography id={headingIds.name} variant="h5">
    Name
  </Typography>
);

export const taglineTitle = (
  <Typography id={headingIds.tagline} variant="h5">
    Tagline
  </Typography>
);

export const problemSolutionTitle = (
  <Typography id={headingIds.problemSolution} variant="h5">
    Problem-Solution
  </Typography>
);

export const rationaleTitle = (
  <Typography id={headingIds.rationale} variant="h5">
    Rationale
  </Typography>
);

export const storyDescription = (
  <section>
    <p>
      There's 6 reasons why things go viral according to the book Contagions by
      Jonah Berger. In the following paragraphs, I'll outline 3 of them.
    </p>
    <p>
      Emotions, perhaps the number one thing which makes an idea catch on. Coca
      cola, being the marketing powerhouse it is, takes full advantage of this.
      I've never seen them market Coca Cola as a sugary drink, instead I've seen
      them associating their product with a feeling of happiness and having a
      good time with your family and friends. No wonder the phrase "Taste the
      feeling" in written next to their logo.
    </p>
    <p>
      Practical value, to whom is your product actually helpful? For example,
      WhatsApp enabled people in Ukraine, where the company's founder is from,
      to communicate for free at a time where text messages were quire pricy.
    </p>
    <p>
      Stories, make your product part of a larger narrative. Take the example
      of, SpaceX which is associated with bringing humans to Mars.
    </p>
  </section>
);
