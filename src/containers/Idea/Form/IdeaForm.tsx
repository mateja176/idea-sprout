import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Info from '@material-ui/icons/Info';
import { Link } from 'components/Link';
import { MultilineTextField } from 'components/MultilineTextField';
import { PageWrapper } from 'components/PageWrapper';
import { Drop, DropProps } from 'containers/Drop';
import { SnackbarContext } from 'context/snackbar';
import { storyDescription } from 'elements/idea/idea';
import { absolutePrivateRoute } from 'elements/routes';
import firebase from 'firebase/app';
import { useFormik } from 'formik';
import { useIdeasRef, useSignedInUser } from 'hooks/firebase';
import {
  CreationIdea,
  creationIdeaSchema,
  IdeaModel,
  ProblemSolutionLength,
  RationaleLength,
} from 'models/idea';
import qs from 'qs';
import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  getFileName,
  getFileNames,
  getFormIdea,
  problemSolutionText,
  rationaleText,
} from 'utils/idea/idea';
import { inputStyle, textareaStyle } from 'utils/styles/styles';
import { ExpectationsCheck } from '../Check/ExpectationsCheck';
import { NicheCheck } from '../Check/NicheCheck';

export interface IdeaFormProps {
  idea: IdeaModel;
}

const exampleLinkStyle: React.CSSProperties = { textDecoration: 'underline' };
const withItalic: React.CSSProperties = { fontStyle: 'italic' };
const noteStyle: React.CSSProperties = { opacity: 0.8 };
const panelDetailsStyle: React.CSSProperties = { flexDirection: 'column' };

export const IdeaForm: React.FC<IdeaFormProps> = ({ idea }) => {
  const initialValues = getFormIdea(idea);

  const history = useHistory();

  const { queueSnackbar } = React.useContext(SnackbarContext);

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
      const newIdea: CreationIdea = {
        ...rawIdea,
        author: user.uid,
        ...formValues,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      return (
        getIdeaRef()
          .set(newIdea)
          // * the promise is not rejected even if the client is offline
          // * the promise is pending until it resolves or the tab is closed
          .then(() => {
            history.push(absolutePrivateRoute.ideas.path, {
              search: qs.stringify({ author: user.uid }),
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

  const setCheck = (name: keyof IdeaModel['checks']) => (
    _: React.ChangeEvent,
    value: boolean,
  ) => {
    const newChecks: IdeaModel['checks'] = { ...idea.checks, [name]: value };

    if (Object.values(newChecks).every(Boolean)) {
      setExpanded(false);
    }

    getIdeaRef().update({ checks: { ...idea.checks, [name]: value } });
  };

  const handleVideoUpload: DropProps['onUploadSuccess'] = React.useCallback(
    ([file]) => {
      setFieldValue('story.path', file.path);
      setFieldValue('story.width', file.width);
      setFieldValue('story.height', file.height);
    },
    [setFieldValue],
  );

  const handleImageUpload: DropProps['onUploadSuccess'] = React.useCallback(
    (files) => {
      files.forEach((file, i) => {
        setFieldValue(`images[${i}].path`, file.path);
        setFieldValue(`images[${i}].width`, file.width);
        setFieldValue(`images[${i}].height`, file.height);
      });
    },
    [setFieldValue],
  );

  const rationaleHelperText =
    (touched.rationale && errors.rationale) || rationaleText;

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
          <ExpansionPanelDetails style={panelDetailsStyle}>
            <NicheCheck
              checked={idea.checks.niche}
              onChange={setCheck('niche')}
            />
            <ExpectationsCheck
              checked={idea.checks.expectations}
              onChange={setCheck('expectations')}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <Box my={3} style={noteStyle}>
          <Typography style={withItalic}>
            Note that you can <strong>refine</strong> all the values{' '}
            <strong>later</strong>, before publishing your idea.
          </Typography>
          <Typography style={withItalic}>
            Feeling <strong>overwhelmed</strong>? Or <strong>not sure</strong>{' '}
            how to proceed exactly?&nbsp;
            {/* TODO turn into collapsible */}
            Check out{' '}
            <Link
              to="dF6lqaZgkEWWj9qWNuiy"
              target="__blank"
              style={exampleLinkStyle}
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
        <React.Suspense
          fallback={<CircularProgress variant={'indeterminate'} />}
        >
          <Drop
            heading="Story"
            description={storyDescription}
            path="videos"
            onUploadSuccess={handleVideoUpload}
            accept="video/*"
            // 50MB
            maxSize={52428800}
            preloadedFileNames={
              initialValues.story.path ? getFileName(initialValues.story) : []
            }
          />
        </React.Suspense>
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
            problemSolutionText
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
            onUploadSuccess={handleImageUpload}
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
          helperText={rationaleHelperText}
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
