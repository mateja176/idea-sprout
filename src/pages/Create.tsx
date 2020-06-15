import {
  Box,
  Button,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Error as ErrorIcon, ExpandMore, Info } from '@material-ui/icons';
import { Check, PageWrapper } from 'components';
import { Drop } from 'containers';
import { useFormik } from 'formik';
import { CreationIdea, ideaSchemaDefinition } from 'models';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { inputStyle, textareaStyle } from 'styles';
import * as yup from 'yup';

export interface CreateProps extends RouteComponentProps {}

const initialValues: CreationIdea = {
  niche: false,
  expectations: false,
  name: '',
  storyURL: '',
  problemSolution: '',
  imageURLs: [],
  rationale: '',
};

type Values = typeof initialValues;

const validationSchema = yup.object().shape<Values>(ideaSchemaDefinition);

export const Create: React.FC<CreateProps> = () => {
  const [expanded, setExpanded] = React.useState(true);
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const {
    isValid,
    isSubmitting,
    touched,
    errors,
    getFieldProps,
    handleSubmit,
    handleChange,
    values,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (formValues) => console.log(formValues),
    validateOnMount: true,
  });

  const hasNicheError = !!touched.niche && !!errors.niche;

  const hasExpectationsError = !!touched.expectations && !!errors.expectations;

  const hasFailedChecks = hasNicheError || hasExpectationsError;

  const handleCheckChange: typeof handleChange = (e) => {
    if ([values.niche && values.expectations]) {
      toggleExpanded();
    }

    handleChange(e);
  };

  const getCheckFieldProps: typeof getFieldProps = (name) => ({
    ...getFieldProps(name),
    handleChange: handleCheckChange,
  });

  return (
    <PageWrapper>
      <form onSubmit={handleSubmit}>
        <ExpansionPanel expanded={expanded} onChange={toggleExpanded}>
          <ExpansionPanelSummary expandIcon={<ExpandMore />}>
            <Box display="flex" alignItems="center">
              <Typography variant="h5">Preflight Checklist</Typography>
              <Box ml={1}>
                <Tooltip
                  title={
                    expanded && hasFailedChecks
                      ? 'Expand to see errors'
                      : 'You can leave this for later'
                  }
                >
                  {hasFailedChecks ? (
                    <ErrorIcon color="secondary" />
                  ) : (
                    <Info color="action" />
                  )}
                </Tooltip>
              </Box>
            </Box>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails style={{ flexDirection: 'column' }}>
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
              getFieldProps={getCheckFieldProps}
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
              getFieldProps={getCheckFieldProps}
              hasError={hasExpectationsError}
              errorMessage={errors.niche}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <Box my={3}>
          <Typography style={{ fontStyle: 'italic' }}>
            Note that you can refine all the values later, before publishing
            your idea.
          </Typography>
        </Box>
        <TextField
          required
          style={inputStyle}
          {...getFieldProps('name')}
          label="Name"
          error={touched.name && !!errors.name}
          helperText={
            (touched.name && errors.name) ||
            'Netflix, if you come up with an abstract name like that, it will be easier to reach the first page of Google.'
          }
        />
        <Drop
          heading="Story"
          path="video"
          onUploadSuccess={([video]) => setFieldValue('storyURL', video)}
          accept="video/*"
          // 50MB
          maxSize={52428800}
        />
        <TextField
          required
          style={textareaStyle}
          {...getFieldProps('problemSolution')}
          label="Problem-Solution"
          multiline
          rows={5}
          fullWidth
          error={touched.problemSolution && !!errors.problemSolution}
          helperText={
            (touched.problemSolution && errors.problemSolution) ||
            'Start with the why, like Simon Sinek famously said. While writing this section, have your ideal customer. ( 100 - 200 )'
          }
        />
        <Drop
          heading="Images"
          path="images"
          onUploadSuccess={(imageURLs) => setFieldValue('imageURLs', imageURLs)}
          accept="image/*"
          // 5MB
          maxSize={5242880}
          multiple
          fileLimit={2}
        />
        <TextField
          required
          style={textareaStyle}
          {...getFieldProps('rationale')}
          label="Rationale"
          multiline
          rows={5}
          fullWidth
          error={touched.rationale && !!errors.rationale}
          helperText={
            (touched.rationale && errors.rationale) ||
            'Win over the hearts of customers with your story. Win over the minds of customers with common logic. ( 100 - 200 )'
          }
        />
        <Box mt={5}>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={!isValid || isSubmitting}
          >
            Create Idea
          </Button>
        </Box>
      </form>
    </PageWrapper>
  );
};
