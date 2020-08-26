import Box from '@material-ui/core/Box';
import useTheme from '@material-ui/core/styles/useTheme';
import { EditorProps } from 'draft-js';
import React from 'react';
import { IdeaPreviewWrapper } from '../../components/Idea/IdeaPreviewWrapper';
import { SectionEditor } from '../../containers/SectionEditor/SectionEditor';
import { Tour } from '../../containers/Tour';
import { PreloadContext } from '../../context/preload';
import { problemSolutionTitle, rationaleTitle } from '../../elements/idea/idea';
import { ideaSelector, ideaTourSteps } from '../../elements/idea/tour';
import { WithMaybeUser } from '../../models/auth';
import {
  IdeaModel,
  NameLength,
  ProblemSolutionLength,
  RationaleLength,
  TaglineLength,
  UpdateIdea,
} from '../../models/idea';
import { ideaMarginBottom } from '../../utils/styles/idea';
import { ideaSectionMl } from '../../utils/styles/styles';
import { FileOptions } from '../FileOptions';
import { Images } from '../Image/Images';
import { VideoSuspender } from '../Video/VideoSuspender';
import { IdeaImagePreviewSuspender } from './ImagePreview/IdeaImagePreviewSuspender';

export interface IdeaProps extends WithMaybeUser {
  idea: IdeaModel;
  update: UpdateIdea;
}

const blockStyleFn: EditorProps['blockStyleFn'] = () => 'MuiTypography-h4';

export const Idea = React.forwardRef<HTMLDivElement, IdeaProps>(
  ({ user, idea, update }, nameWrapperRef) => {
    const preloaded = React.useContext(PreloadContext);

    const theme = useTheme();

    const isAuthor = user?.uid === idea.author;

    const saveName = React.useCallback(
      (name: IdeaModel['name']) => {
        update({ name });
      },
      [update],
    );

    const saveLogo = React.useCallback(
      (logo: IdeaModel['logo']) => update({ logo }),
      [update],
    );

    const saveTagline = React.useCallback(
      (tagline: IdeaModel['tagline']) => {
        update({ tagline });
      },
      [update],
    );

    const saveProblemSolution = React.useCallback(
      (problemSolution) => {
        update({
          problemSolution,
        });
      },
      [update],
    );

    const saveRationale = React.useCallback(
      (rationale) => {
        update({
          rationale,
        });
      },
      [update],
    );

    const logoOptionsStyle: React.CSSProperties = React.useMemo(
      () => ({ visibility: isAuthor ? 'visible' : 'hidden' }),
      [isAuthor],
    );

    return (
      <Box
        flex={1}
        display={'flex'}
        flexDirection={'column'}
        overflow={'auto'}
        bgcolor={theme.palette.background.paper}
      >
        <Tour steps={ideaTourSteps} run={isAuthor} />
        <Box id={ideaSelector.logo} display={'flex'} mx={ideaSectionMl}>
          {preloaded.logoUrl ? ( // TODO if image preloaded.idea.id === idea.id
            <IdeaPreviewWrapper>
              <img src={preloaded.logoUrl} alt={'Preview'} height={'100%'} />
            </IdeaPreviewWrapper>
          ) : (
            <IdeaImagePreviewSuspender path={idea.logo.path} />
          )}
          <Box style={logoOptionsStyle}>
            <FileOptions
              storagePath={'images'}
              update={saveLogo}
              variant={'right'}
              justify={'flex-start'}
              label={'New logo'}
            />
          </Box>
        </Box>
        <SectionEditor
          id={ideaSelector.name}
          mb={0}
          ref={nameWrapperRef}
          isAuthor={isAuthor}
          min={NameLength.min}
          max={NameLength.max}
          text={idea.name}
          onSave={saveName}
          blockStyleFn={blockStyleFn}
        />
        <SectionEditor
          id={ideaSelector.tagline}
          mt={0}
          mb={2}
          isAuthor={isAuthor}
          min={TaglineLength.min}
          max={TaglineLength.max}
          text={idea.tagline}
          onSave={saveTagline}
        />
        <VideoSuspender
          story={idea.story}
          isAuthor={isAuthor}
          update={update}
        />
        <SectionEditor
          id={ideaSelector.problemSolution}
          isAuthor={isAuthor}
          title={problemSolutionTitle}
          text={idea.problemSolution}
          min={ProblemSolutionLength.min}
          max={ProblemSolutionLength.max}
          onSave={saveProblemSolution}
        />
        <Images
          ideaName={idea.name}
          images={idea.images}
          isAuthor={isAuthor}
          update={update}
        />
        <SectionEditor
          id={ideaSelector.rationale}
          isAuthor={isAuthor}
          title={rationaleTitle}
          text={idea.rationale}
          min={RationaleLength.min}
          max={RationaleLength.max}
          onSave={saveRationale}
          mb={ideaMarginBottom}
        />
      </Box>
    );
  },
);
