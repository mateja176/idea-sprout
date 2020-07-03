import { Box } from '@material-ui/core';
import { TitleEditor } from 'containers';
import { problemSolutionTitle, rationaleTitle } from 'elements';
import { IdeaModel, RawIdea, User } from 'models';
import React from 'react';
import { contentToText, getIsAuthor } from 'utils';
import { Images } from '../Image';
import { VideoSuspender } from '../Video';

export interface IdeaProps {
  user: User;
  idea: IdeaModel;
  update: (idea: Partial<RawIdea>) => Promise<void>;
}

export const Idea: React.FC<IdeaProps> = ({ user, idea, update }) => {
  const isAuthor = getIsAuthor(user)(idea);

  return (
    <Box>
      <VideoSuspender {...idea.story} />
      <TitleEditor
        isAuthor={isAuthor}
        title={problemSolutionTitle}
        text={idea.problemSolution}
        onBlur={(editorState) => {
          const text = contentToText(editorState);
          if (text !== idea.problemSolution) {
            update({
              problemSolution: text,
            });
          }
        }}
      />
      <Images images={idea.images} />
      <TitleEditor
        isAuthor={isAuthor}
        title={rationaleTitle}
        text={idea.rationale}
        onBlur={(editorState) => {
          const text = contentToText(editorState);
          if (text !== idea.rationale) {
            update({
              rationale: text,
            });
          }
        }}
      />
    </Box>
  );
};
