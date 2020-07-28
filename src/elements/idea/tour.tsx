import { Box, Typography } from '@material-ui/core';
import appleLogo1977 from 'img/apple-logo-1977.png';
import appleLogo2003 from 'img/apple-logo-2003.png';
import { init, last } from 'ramda';
import React from 'react';
import { Step } from 'react-joyride';
import { getAppleIdea } from 'utils';

const logoSize = 200;

export const ideaSelector = {
  name: 'name',
  logo: 'logo',
  tagline: 'tagline',
  story: 'story',
  problemSolution: 'problem-solution',
  image: 'image',
  rationale: 'rationale',
};

export const ideaId = Object.fromEntries(
  Object.entries(ideaSelector).map(([key, selector]) => [key, `#${selector}`]),
) as Record<keyof typeof ideaSelector, string>;

const appleIdea = getAppleIdea('');

const problemSolutionSentences = appleIdea.problemSolution.split('. ');

export const ideaTourSteps: Step[] = [
  {
    title: "Let's create our first idea together",
    content:
      "You'll soon see why, but imagine for a moment that you are back in 1976.",
    target: 'body',
    placement: 'center',
  },
  {
    title: 'Name',
    content: (
      <Box>
        You and your co-founder are driving down the highway after having
        visited an orchard. And all of a sudden you think of the perfect name
        for your company. Something fun and non-intimidating like,{' '}
        <strong>Apple</strong>.
      </Box>
    ),
    target: ideaId.name,
    placement: 'bottom-start',
  },
  {
    title: 'Logo',
    content: (
      <Box>
        <Typography>
          The first logo is Apple's logo from 1977 and second logo is Apple's
          latest logo from 2003. As they say: <strong>Less is more</strong>.
        </Typography>
        <Box
          mt={2}
          display={'flex'}
          flexDirection={'column'}
          alignItems={'center'}
        >
          <Box mb={1}>
            <img
              src={appleLogo1977}
              width={logoSize}
              height={logoSize}
              alt="Apple's logo from 1977"
            />
          </Box>
          <img src={appleLogo2003} width={logoSize} alt="Apple's latest logo" />
        </Box>
      </Box>
    ),
    target: ideaId.tagline,
    placement: 'bottom-start',
  },
  {
    title: 'Tagline',
    content: (
      <Box>
        Although the famous slogan first appeared in 1997, it is an iconic
        sentence that perfectly embodies the company's philosophy -{' '}
        <strong>Think Different</strong>.
      </Box>
    ),
    target: ideaId.tagline,
    placement: 'bottom-start',
  },
  {
    title: 'Story',
    content: (
      <Box>
        A number of movies revolved around how Apple Computers was founded.
        However, the story of the personal computers is also remarkable, for
        many prominent people of the time thought it was ridiculous. On the
        other hand, <strong>Jobs and Wozniak</strong> wanted to make computers
        small and accessible enough for people to have them in their homes or
        offices.
      </Box>
    ),
    target: ideaId.story,
    placement: 'bottom-start',
  },
  {
    title: 'Problem-Solution',
    content: (
      <Box>
        This is a given in today's era, however the problem-solution statement
        for Apple Computers may look like this:
        {init(problemSolutionSentences)}.{' '}
        <strong>{last(problemSolutionSentences)}</strong>
      </Box>
    ),
    target: ideaId.problemSolution,
    placement: 'bottom-start',
  },
  {
    title: 'Image',
    content: (
      <Box>
        When you visit{' '}
        <a href={'https://apple.com/mac'} target={'__blank'}>
          <i>apple.com/mac</i>
        </a>{' '}
        you are immediately greeted with an image of the product, which
        demonstrates the power and impact of visuals. However the image can be
        as simple as a hand drawn concept using{' '}
        <a
          href={'https://www.invisionapp.com/feature/freehand'}
          target={'__blank'}
        >
          <strong>InVision Freehand</strong>
        </a>{' '}
        or a more precessional looking mockup created in i.e.{' '}
        <a href={'https://figma.com'} target={'__blank'}>
          <strong>Figma</strong>
        </a>
        .
      </Box>
    ),
    target: ideaId.image,
    placement: 'bottom-start',
  },
  {
    title: 'Rationale',
    content: (
      <Box>
        A simple example would be <strong>outlining the many benefits</strong>{' '}
        computers offer to people. {appleIdea.rationale}
      </Box>
    ),
    target: ideaId.rationale,
    placement: 'bottom-start',
  },
];
