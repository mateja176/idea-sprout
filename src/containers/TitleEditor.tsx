import { Box, IconButton } from '@material-ui/core';
import { Cancel, Edit } from '@material-ui/icons';
import { useBoolean } from 'ahooks';
import { IdeaSection } from 'components';
import {
  ContentState,
  Editor as DraftEditor,
  EditorProps,
  EditorState,
  SelectionState,
} from 'draft-js';
import React from 'react';

const moveSelectionToEnd = (editorState: EditorState) => {
  const content = editorState.getCurrentContent();
  const blockMap = content.getBlockMap();

  const key = blockMap.last().getKey();
  const length = blockMap.last().getLength();

  const selection = new SelectionState({
    anchorKey: key,
    anchorOffset: length,
    focusKey: key,
    focusOffset: length,
  });
  return EditorState.forceSelection(editorState, selection);
};

export const TitleEditor: React.FC<
  Omit<EditorProps, 'editorState' | 'onChange' | 'onFocus' | 'onBlur'> & {
    title: React.ReactNode;
    text: string;
    onFocus?: EditorProps['onChange'];
    onBlur?: EditorProps['onChange'];
  }
> = ({ title, text, onFocus = () => {}, onBlur = () => {}, ...props }) => {
  const [editorState, setEditorState] = React.useState(
    EditorState.createWithContent(ContentState.createFromText(text)),
  );

  React.useEffect(() => {
    setEditorState(
      EditorState.createWithContent(ContentState.createFromText(text)),
    );
  }, [text]);

  const editorRef = React.useRef<DraftEditor | null>(null);

  const focus = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const [editing, setEditing] = useBoolean();

  return (
    <IdeaSection>
      <Box display={'flex'} alignItems={'center'}>
        {title}&nbsp;
        {editing ? (
          <IconButton
            size={'small'}
            onClick={() => {
              setEditing.setFalse();
            }}
          >
            <Cancel />
          </IconButton>
        ) : (
          <IconButton
            size="small"
            color="primary"
            onClick={() => {
              setEditing.setTrue();

              setEditorState(moveSelectionToEnd(editorState));
            }}
          >
            <Edit />
          </IconButton>
        )}
      </Box>
      <Box onClick={focus}>
        <DraftEditor
          ref={editorRef}
          editorState={editorState}
          onChange={setEditorState}
          {...props}
          onFocus={() => {
            onFocus(editorState);
          }}
          onBlur={() => {
            setEditing.setFalse();
            onBlur(editorState);
          }}
        />
      </Box>
    </IdeaSection>
  );
};
