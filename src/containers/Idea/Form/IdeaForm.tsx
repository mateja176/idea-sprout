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
import { ExpandMore, Info } from '@material-ui/icons';
import { Link, MultilineTextField, PageWrapper } from 'components';
import { Drop } from 'containers';
import firebase from 'firebase/app';
import { useFormik } from 'formik';
import {
  creationIdeaSchema,
  IdeaModel,
  ProblemSolutionLength,
  RationaleLength,
  RawIdea,
} from 'models';
import qs from 'qs';
import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  createQueueSnackbar,
  useActions,
  useIdeasRef,
  useSignedInUser,
} from 'services';
import { inputStyle, textareaStyle } from 'styles';
import {
  absolutePrivateRoute,
  getFileName,
  getFileNames,
  getFormIdea,
} from 'utils';
import { ExpectationsCheck, NicheCheck } from '../Check';

export interface IdeaFormProps {
  idea: IdeaModel;
}

export const IdeaForm: React.FC<IdeaFormProps> = ({ idea }) => {
  const initialValues = getFormIdea(idea);

  const history = useHistory();

  const { queueSnackbar } = useActions({ queueSnackbar: createQueueSnackbar });

  const ideasRef = useIdeasRef();
  const getIdeaRef = () => (idea.id ? ideasRef.doc(idea.id) : ideasRef.doc());

  const user = useSignedInUser();

  const [expanded, setExpanded] = React.useState(
    Object.values(idea.checks).some((check) => !check),
  );
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
    values,
    setFieldValue,
  } = useFormik({
    validationSchema: creationIdeaSchema,
    initialValues,
    onSubmit: (formValues) => {
      const { id, ...rawIdea } = idea;
      const newIdea: RawIdea = {
        ...rawIdea,
        author: user.email || '',
        ...formValues,
        createdAt: firebase.firestore.Timestamp.now(),
      };

      return (
        getIdeaRef()
          .set(newIdea)
          // * the promise is not rejected even if the client is offline
          // * the promise is pending until it resolves or the tab is closed
          .then(() => {
            history.push(absolutePrivateRoute.ideas.path, {
              search: qs.stringify({ author: user.email }),
            });

            queueSnackbar({
              severity: 'success',
              message: `Success! Sharing your idea increase the likelihood of success drastically`,
              autoHideDuration: 60000,
            });
          })
      );
    },
    validateOnMount: true,
  });

  const [checks, setChecks] = React.useState(idea.checks);

  React.useEffect(() => {
    setChecks(idea.checks);
  }, [idea.checks]);

  const setCheck = (name: keyof IdeaModel['checks']) => (
    _: React.ChangeEvent,
    value: boolean,
  ) => {
    const newChecks: IdeaModel['checks'] = { ...checks, [name]: value };

    setChecks(newChecks);

    if (Object.values(newChecks).every(Boolean)) {
      setExpanded(false);
    }

    getIdeaRef().update({ checks: { ...idea.checks, [name]: value } });
  };

  return (
    <PageWrapper>
      <form onSubmit={handleSubmit}>
        <ExpansionPanel expanded={expanded} onChange={toggleExpanded}>
          <ExpansionPanelSummary expandIcon={<ExpandMore />}>
            <Box display="flex" alignItems="center">
              <Typography variant="h5">Preflight Checklist</Typography>
              <Box ml={1}>
                <Tooltip title={'You can leave this for later'}>
                  <Info color="action" />
                </Tooltip>
              </Box>
            </Box>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails style={{ flexDirection: 'column' }}>
            <NicheCheck checked={checks.niche} onChange={setCheck('niche')} />
            <ExpectationsCheck
              checked={checks.expectations}
              onChange={setCheck('expectations')}
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
            {/* TODO turn into collapsible */}
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
          onUploadSuccess={([file]) => {
            setFieldValue('story.path', file.path);
            setFieldValue('story.width', file.width);
            setFieldValue('story.height', file.height);
          }}
          accept="video/*"
          // 50MB
          maxSize={52428800}
          preloadedFileNames={
            initialValues.story.path ? getFileName(initialValues.story) : []
          }
        />
        <MultilineTextField
          required
          style={textareaStyle}
          {...getFieldProps('problemSolution')}
          label={`Problem-Solution: ${values.problemSolution.length} (${ProblemSolutionLength.min}-${ProblemSolutionLength.max})`}
          rows={4}
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
            onUploadSuccess={(files) => {
              files.forEach((file, i) => {
                setFieldValue(`images[${i}].path`, file.path);
                setFieldValue(`images[${i}].width`, file.width);
                setFieldValue(`images[${i}].height`, file.height);
              });
            }}
            accept="image/*"
            // 5MB
            maxSize={5242880}
            multiple
            fileLimit={2}
            preloadedFileNames={getFileNames(initialValues.images)}
          />
        </Box>
        <MultilineTextField
          required
          style={textareaStyle}
          {...getFieldProps('rationale')}
          label={`Rationale: ${values.rationale.length} (${RationaleLength.min}-${RationaleLength.max})`}
          rows={6}
          fullWidth
          error={touched.rationale && !!errors.rationale}
          helperText={
            (touched.rationale && errors.rationale) ||
            `Win over the hearts of customers with your story. Win over the minds of customers with common logic.`
          }
        />
        <Box mt={10} mb={15}>
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
