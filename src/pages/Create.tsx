import {
  Box,
  Button,
  CheckboxProps,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Error as ErrorIcon, ExpandMore, Info } from '@material-ui/icons';
import { Link, PageWrapper } from 'components';
import { Check, Drop } from 'containers';
import { useFormik } from 'formik';
import {
  CheckFieldNames,
  checkNames,
  CreationIdea,
  GetCheckFieldProps,
  ideaSchemaDefinition,
  ProblemSolutionLength,
  RationaleLength,
  User,
} from 'models';
import React from 'react';
import { useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import {
  createQueueSnackbar,
  selectUser,
  useActions,
  useIdeas,
} from 'services';
import { inputStyle, textareaStyle } from 'styles';
import * as yup from 'yup';

export interface CreateProps extends RouteComponentProps {}

const initialValues: CreationIdea = {
  niche: false,
  expectations: false,
  name: '',
  storyPath: '',
  problemSolution: '',
  imagePaths: [],
  rationale: '',
};

type Values = typeof initialValues;

const validationSchema = yup.object().shape<Values>(ideaSchemaDefinition);

export const Create: React.FC<CreateProps> = () => {
  const { queueSnackbar } = useActions({ queueSnackbar: createQueueSnackbar });

  const ideaRef = useIdeas().doc();

  const user = useSelector(selectUser);

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
    onSubmit: (formValues) => {
      const idea = { ...formValues, author: (user as User).email };

      return ideaRef
        .set(idea)
        .then(() => {
          queueSnackbar({
            severity: 'success',
            message: `Success! Sharing your idea increase the likelihood of success drastically`,
            autoHideDuration: 60000,
          });
        })
        .catch((error: Error) => {
          queueSnackbar({
            severity: 'error',
            message: error.message,
          });
        });
    },
    validateOnMount: true,
  });

  const hasNicheError = !!touched.niche && !!errors.niche;

  const hasExpectationsError = !!touched.expectations && !!errors.expectations;

  const hasFailedChecks = hasNicheError || hasExpectationsError;

  const handleCheckChange = (
    name: CheckFieldNames,
  ): CheckboxProps['onChange'] => (e, value) => {
    if (
      checkNames.every((checkName) =>
        checkName === name ? values[checkName] || value : values[checkName],
      )
    ) {
      toggleExpanded();
    }

    handleChange(e);
  };

  const getCheckFieldProps: GetCheckFieldProps = (name) => ({
    ...getFieldProps(name),
    onChange: handleCheckChange(name),
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
        <Box my={3} style={{ opacity: 0.8 }}>
          <Typography style={{ fontStyle: 'italic' }}>
            Note that you can <strong>refine</strong> all the values{' '}
            <strong>later</strong>, before publishing your idea.
          </Typography>
          <Typography style={{ fontStyle: 'italic' }}>
            Feeling <strong>overwhelmed</strong>? Or <strong>not sure</strong>{' '}
            how to proceed exactly?&nbsp;
            {/* TODO link to Sprout Zero */}
            Check out{' '}
            <Link
              to="dF6lqaZgkEWWj9qWNuiy"
              target="__blank"
              style={{ textDecoration: 'underline' }}
            >
              this example.
            </Link>
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
          description={
            <section>
              <p>
                There's 6 reasons why things go viral according to the book
                Contagions by Jonah Berger. In the following paragraphs, I'll
                outline 3 of them.
              </p>
              <p>
                Emotions, perhaps the number one thing which makes an idea catch
                on. Coca cola, being the marketing powerhouse it is, takes full
                advantage of this. I've never seen them market Coca Cola as a
                sugary drink, instead I've seen them associating their product
                with a feeling of happiness and having a good time with your
                family and friends. No wonder the phrase "Taste the feeling" in
                written next to their logo.
              </p>
              <p>
                Practical value, to whom is your product actually helpful? For
                example, WhatsApp enabled people in Ukraine, where the company's
                founder is from, to communicate for free at a time where text
                messages were quire pricy.
              </p>
              <p>
                Stories, make your product part of a larger narrative. Take the
                example of, SpaceX is associated with bringing humans to Mars.
              </p>
            </section>
          }
          path="videos"
          onUploadSuccess={([video]) => {
            console.log(video);

            setFieldValue('storyPath', video);
          }}
          accept="video/*"
          // 50MB
          maxSize={52428800}
        />
        <TextField
          required
          style={textareaStyle}
          {...getFieldProps('problemSolution')}
          label={`Problem-Solution: ${values.problemSolution.length} (${ProblemSolutionLength.min}-${ProblemSolutionLength.max})`}
          multiline
          rows={5}
          fullWidth
          error={touched.problemSolution && !!errors.problemSolution}
          helperText={
            (touched.problemSolution && errors.problemSolution) ||
            `What do all successful businesses have in common? They either solve a problem or bring a feeling of well-being to their customers. Write this section with your ideal customer in mind.`
          }
        />
        <Box mt={6}>
          <Drop
            heading="Images"
            description={
              <section>
                <p>
                  There was once an amateur photographer who created an online
                  photo gallery for himself.
                </p>
                <p>
                  He included all of his best images at the top, followed by a
                  number of lesser photos which were, none the less, still good.
                  He received positive feedback on his images and people though
                  that he was quite a good photographer.
                </p>
                <p>
                  Then, one day he tried something different. He removed all the
                  lesser images form his collection and left only the highest
                  quality images. He was shocked at the reactions of new
                  reviewers! While people thought of him as a good photographer
                  before, they now perceived him as a professional.
                </p>
                <p>Be amazing like the photographer.</p>
              </section>
            }
            path="images"
            onUploadSuccess={(imagePaths) => {
              console.log(imagePaths);
              setFieldValue('imagePaths', imagePaths);
            }}
            accept="image/*"
            // 5MB
            maxSize={5242880}
            multiple
            fileLimit={2}
          />
        </Box>
        <TextField
          required
          style={textareaStyle}
          {...getFieldProps('rationale')}
          label={`Rationale: ${values.rationale.length} (${RationaleLength.min}-${RationaleLength.max})`}
          multiline
          rows={5}
          fullWidth
          error={touched.rationale && !!errors.rationale}
          helperText={
            (touched.rationale && errors.rationale) ||
            `Win over the hearts of customers with your story. Win over the minds of customers with common logic.`
          }
        />
        <Box mt={5} mb={15}>
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
