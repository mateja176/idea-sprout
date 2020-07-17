import { Box } from '@material-ui/core';
import { SectionEditor } from 'containers';
import { problemSolutionTitle, rationaleTitle } from 'elements';
import {
  IdeaModel,
  NameLength,
  ProblemSolutionLength,
  RationaleLength,
  UpdateIdea,
  User,
} from 'models';
import React from 'react';
import { ideaMarginBottom } from 'styles';
import { Images } from '../Image';
import { VideoSuspender } from '../Video';

export interface IdeaProps {
  user: User;
  idea: IdeaModel;
  update: UpdateIdea;
}

export const Idea: React.FC<IdeaProps> = ({ user, idea, update }) => {
  const isAuthor = user.uid === idea.author;

  const saveName = React.useCallback(
    (name: IdeaModel['name']) => {
      update({ name });
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

  return (
    <Box flex={1} display={'flex'} flexDirection={'column'} overflow={'auto'}>
      <SectionEditor
        isAuthor={isAuthor}
        title={''}
        min={NameLength.min}
        max={NameLength.max}
        text={idea.name}
        onSave={saveName}
        blockStyleFn={() => 'MuiTypography-h4'}
      />
      <VideoSuspender story={idea.story} isAuthor={isAuthor} update={update} />
      <SectionEditor
        isAuthor={isAuthor}
        title={problemSolutionTitle}
        text={idea.problemSolution}
        min={ProblemSolutionLength.min}
        max={ProblemSolutionLength.max}
        onSave={saveProblemSolution}
      />
      <Images images={idea.images} isAuthor={isAuthor} update={update} />
      <SectionEditor
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
};
