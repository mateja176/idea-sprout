import { Box, Chip, FormHelperText, useTheme } from '@material-ui/core';
import { Cancel, Edit } from '@material-ui/icons';
import { IdeaSection, IdeaSectionProps } from 'components';
import {
  ContentState,
  Editor as DraftEditor,
  EditorProps,
  EditorState,
  getDefaultKeyBinding,
} from 'draft-js';
import React from 'react';
import { contentToText } from 'utils';

const editingStates = ['off', 'blur', 'focus', 'tooShort', 'tooLong'] as const;
type EditingStates = typeof editingStates;
type EditingState = EditingStates[number];

export const SectionEditor: React.FC<
  Omit<EditorProps, 'editorState' | 'onChange'> & {
    isAuthor: boolean;
    title: React.ReactNode;
    text: string;
    min: number;
    max: number;
    onSave: (text: string) => void;
  } & Pick<IdeaSectionProps, 'mb'>
> = ({ isAuthor, title, text, min, max, onSave, mb, ...props }) => {
  const theme = useTheme();

  const [editorState, setEditorState] = React.useState(
    EditorState.createWithContent(ContentState.createFromText(text)),
  );

  React.useEffect(() => {
    setEditorState(
      EditorState.createWithContent(ContentState.createFromText(text)),
    );
  }, [text]);

  const editorRef = React.useRef<DraftEditor | null>(null);

  const [editingState, setEditingState] = React.useState<EditingState>(
    editingStates[0],
  );
  const editing =
    editingState === 'focus' ||
    editingState === 'tooShort' ||
    editingState === 'tooLong';

  const editorStateText = React.useMemo(() => contentToText(editorState), [
    editorState,
  ]);

  const isTooShort = editorStateText.length < min;
  const isTooLong = editorStateText.length > max;
  const isInvalid = isTooShort || isTooLong;
  const isValid = !isInvalid;

  const focus = React.useCallback(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, []);

  const blur = React.useCallback(() => {
    if (editorRef.current) {
      editorRef.current.blur();
    }
  }, []);

  const cancel = () => {
    setEditorState(
      EditorState.createWithContent(ContentState.createFromText(text)),
    );
    setEditingState('blur');
  };

  React.useEffect(() => {
    switch (editingState) {
      case 'blur':
        blur();
        break;
      case 'tooShort':
      case 'tooLong':
        focus();
        break;
      case 'focus':
        break;
      case 'off':
        break;
    }
  }, [editingState, focus, blur, editorState]);

  return (
    <IdeaSection mb={mb}>
      <Box display={'flex'} alignItems={'center'}>
        {title}&nbsp;
        {isAuthor && (
          <Box
            onMouseDown={(e) => {
              e.preventDefault();

              if (editing) {
                cancel();
              } else {
                setEditingState('focus');
                setEditorState(EditorState.moveFocusToEnd(editorState));
              }
            }}
          >
            <Chip
              icon={editing ? <Cancel /> : <Edit />}
              label={
                <Box
                  display={'flex'}
                  alignItems={'center'}
                  color={theme.palette.text.secondary}
                >
                  <Box>{min}</Box>
                  &nbsp;{'<'}&nbsp;
                  <Box color={theme.palette.primary.main}>
                    {editorStateText.length}
                  </Box>
                  &nbsp;{'<'}&nbsp;
                  <Box>{max}</Box>
                </Box>
              }
              color={isValid ? 'primary' : 'secondary'}
              clickable
              variant={'outlined'}
            />
          </Box>
        )}
      </Box>
      <Box onClick={focus}>
        <DraftEditor
          ref={editorRef}
          editorState={editorState}
          onChange={setEditorState}
          readOnly={!isAuthor}
          {...props}
          keyBindingFn={(e) => {
            switch (e.key) {
              case 'Enter':
                return 'save';

              case 'Escape':
                return 'cancel';

              default:
                return getDefaultKeyBinding(e);
            }
          }}
          handleKeyCommand={(command) => {
            switch (command) {
              case 'save':
                setEditingState('blur');
                return 'handled';

              case 'cancel':
                cancel();
                return 'handled';

              default:
                return 'not-handled';
            }
          }}
          onFocus={(e) => {
            setEditingState('focus');
            if (props.onFocus) {
              props.onFocus(e);
            }
          }}
          onBlur={(e) => {
            if (isTooShort) {
              setEditingState('tooShort');
            } else if (isTooLong) {
              setEditingState('tooLong');
            } else if (editorStateText === text) {
              setEditingState('off');
            } else {
              setEditingState('off');
              onSave(editorStateText);
            }
            if (props.onBlur) {
              props.onBlur(e);
            }
          }}
        />
      </Box>
      <Box visibility={isValid ? 'hidden' : 'visible'}>
        <FormHelperText error>
          {isTooShort
            ? 'Text is too short'
            : isTooLong
            ? 'Text is too long'
            : 'Placeholder'}
        </FormHelperText>
      </Box>
    </IdeaSection>
  );
};
