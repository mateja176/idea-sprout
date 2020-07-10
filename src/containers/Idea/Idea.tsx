import { Box } from '@material-ui/core';
import { SectionEditor } from 'containers';
import { problemSolutionTitle, rationaleTitle } from 'elements';
import {
  IdeaModel,
  ProblemSolutionLength,
  RationaleLength,
  UpdateIdea,
  User,
} from 'models';
import React from 'react';
import { Images } from '../Image';
import { VideoSuspender } from '../Video';

export interface IdeaProps {
  user: User;
  idea: IdeaModel;
  update: UpdateIdea;
}

export const Idea: React.FC<IdeaProps> = ({ user, idea, update }) => {
  const isAuthor = user.email === idea.author;

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
    <Box>
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
      />
    </Box>
  );
};
