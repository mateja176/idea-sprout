import { Box } from '@material-ui/core';
import { TitleEditor } from 'containers';
import { problemSolutionTitle, rationaleTitle } from 'elements';
import { IdeaModel, RawIdea } from 'models';
import React from 'react';
import { contentToText } from 'utils';
import { Images } from '../Image';
import { VideoSuspender } from '../Video';

export interface IdeaProps {
  idea: IdeaModel;
  update: (idea: Partial<RawIdea>) => Promise<void>;
}

export const Idea: React.FC<IdeaProps> = ({ idea, update }) => {
  return (
    <Box>
      <VideoSuspender {...idea.story} />
      <TitleEditor
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
