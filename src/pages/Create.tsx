import {
  Box,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Error as ErrorIcon, ExpandMore } from '@material-ui/icons';
import { Check, PageWrapper } from 'components';
import { useFormik } from 'formik';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import * as yup from 'yup';

export interface CreateProps extends RouteComponentProps {}

const initialValues = {
  niche: false,
  expectations: false,
};

const checkSchema = yup
  .bool()
  .test('Checked', 'Field has to be checked', Boolean)
  .required();

type Values = typeof initialValues;

const validationSchema = yup.object().shape<Values>({
  niche: checkSchema,
  expectations: checkSchema,
});

export const Create: React.FC<CreateProps> = () => {
  const [expanded, setExpanded] = React.useState(true);
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const { touched, errors, getFieldProps, handleSubmit } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (formValues) => console.log(formValues),
  });

  const hasNicheError = !!touched.niche && !!errors.niche;

  const hasExpectationsError = !!touched.expectations && !!errors.expectations;

  const hasError = hasNicheError || hasExpectationsError;

  return (
    <PageWrapper>
      <ExpansionPanel expanded={expanded} onChange={toggleExpanded}>
        <ExpansionPanelSummary expandIcon={<ExpandMore />}>
          <Box display="flex" alignItems="center">
            <Typography variant="h5">Preflight Checklist</Typography>
            {hasError && (
              <Box ml={1}>
                <Tooltip title={expanded ? '' : 'Expand to see errors'}>
                  <ErrorIcon color="secondary" />
                </Tooltip>
              </Box>
            )}
          </Box>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <form onSubmit={handleSubmit}>
            <Check
              name="niche"
              label="Choose a niche"
              description={
                <section>
                  <p>
                    Almost every product has a potential to reach the mass
                    market and become a household name. However, almost no
                    product reached mass market adoption out of the box, since
                    there are only so many Aspirins to be in the world.
                  </p>
                  <p>
                    Take the example of Tesla Motors, everybody can and perhaps
                    should drive an electric car, but around 2008, there was
                    almost no interest in electric vehicles among the public.
                    Tesla had a vision, however they also had a gap to bridge.
                    Hence they decided to launch the Tesla Roadster, an
                    attractive all electric sports car. This attracted
                    celebrities and sport car enthusiasts alike, which had the
                    added benefit of putting the company in the public limelight
                    which ultimately enabled them to sway peoples opinion on how
                    cool electric cars can be.
                  </p>
                  <p>
                    And nowadays with the Model 3, they are on the brink on
                    producing an electric car for the masses.
                  </p>
                </section>
              }
              getFieldProps={getFieldProps}
              hasError={hasNicheError}
              errorMessage={errors.niche}
            />
            <Check
              name="expectations"
              label="Set expectations"
              description={
                <section>
                  <p>
                    Setting up high expectations can sometimes increase
                    motivation and interest for a product, however setting the
                    bar up too high can have the opposite effect.
                  </p>
                  <p>
                    It's possible for your to get manufacturing costs down
                    significantly after having scaled your company, however, it
                    takes time to get up to scale and process is gradual with
                    ups and downs.
                  </p>
                  <p>
                    Establishing trust with your early adopters by cherishing
                    transparency and honesty can bring you a long way. Hence, be
                    realistic of what you can offer to users in this period of
                    time.
                  </p>
                </section>
              }
              getFieldProps={getFieldProps}
              hasError={hasExpectationsError}
              errorMessage={errors.niche}
            />
          </form>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </PageWrapper>
  );
};
