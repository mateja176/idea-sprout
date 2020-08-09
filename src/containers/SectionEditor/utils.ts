import { convertToRaw, EditorState } from 'draft-js';

export const stateToString = (editorState: EditorState): string => {
  const text = convertToRaw(editorState.getCurrentContent())
    .blocks.reduce((text, block) => text.concat('\n', block.text), '')
    .trim();
  return text;
};
