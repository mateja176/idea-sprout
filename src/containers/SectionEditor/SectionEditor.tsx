import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import FormHelperText from '@material-ui/core/FormHelperText';
import useTheme from '@material-ui/core/styles/useTheme';
import Cancel from '@material-ui/icons/Cancel';
import Edit from '@material-ui/icons/Edit';
import {
  ContentState,
  Editor as DraftEditor,
  EditorProps,
  EditorState,
  getDefaultKeyBinding,
} from 'draft-js';
import React from 'react';
import {
  IdeaSection,
  IdeaSectionProps,
} from '../../components/Idea/IdeaSection';
import { stateToString } from './utils';

const editingStates = ['off', 'blur', 'focus', 'tooShort', 'tooLong'] as const;
type EditingStates = typeof editingStates;
type EditingState = EditingStates[number];

const initialFocusStyle = {
  boxShadow: '1px 1px #fff, -1px -1px #fff',
  borderRadius: '4px',
};

const keyBindingFn: EditorProps['keyBindingFn'] = (e) => {
  switch (e.key) {
    case 'Enter':
      return 'save';

    case 'Escape':
      return 'cancel';

    default:
      return getDefaultKeyBinding(e);
  }
};

export const SectionEditorWithRef: React.RefForwardingComponent<
  HTMLDivElement,
  Omit<EditorProps, 'editorState' | 'onChange'> & {
    isAuthor: boolean;
    text: string;
    min: number;
    max: number;
    onSave: (text: string) => void;
    title?: React.ReactNode;
  } & Pick<IdeaSectionProps, 'id' | 'mt' | 'mb'>
> = (
  { id, isAuthor, title, text, min, max, onSave, mt, mb, ...props },
  editorWrapperRef,
) => {
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

  const editorStateText = React.useMemo(() => stateToString(editorState), [
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

  const cancel = React.useCallback(() => {
    setEditorState(
      EditorState.createWithContent(ContentState.createFromText(text)),
    );
    setEditingState('blur');
  }, [setEditorState, setEditingState, text]);

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

  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const animateFocus = React.useCallback(() => {
    wrapperRef.current?.animate(
      [
        initialFocusStyle,
        {
          boxShadow: `1px 1px ${theme.palette.primary.main}, -1px -1px ${theme.palette.primary.main}`,
          borderRadius: '4px',
        },
        initialFocusStyle,
      ],
      { duration: 1000, easing: 'cubic-bezier(0, .50, 1, .50)' },
    );
  }, [theme.palette.primary.main]);

  const handleKeyCommand: EditorProps['handleKeyCommand'] = React.useCallback(
    (command) => {
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
    },
    [setEditingState, cancel],
  );

  const handleFocus: EditorProps['onFocus'] = React.useCallback(
    (e) => {
      animateFocus();
      setEditingState('focus');
      if (props.onFocus) {
        props.onFocus(e);
      }
    },
    [animateFocus, setEditingState, props],
  );

  const handleBlur: EditorProps['onBlur'] = React.useCallback(
    (e) => {
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
    },
    [
      setEditingState,
      onSave,
      props,
      editorStateText,
      isTooLong,
      isTooShort,
      text,
    ],
  );

  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = React.useCallback(
    (e) => {
      e.preventDefault();

      if (editing) {
        cancel();
      } else {
        animateFocus();
        setEditingState('focus');
        setEditorState(EditorState.moveFocusToEnd(editorState));
      }
    },
    [
      cancel,
      animateFocus,
      setEditingState,
      setEditorState,
      editing,
      editorState,
    ],
  );

  return (
    <IdeaSection id={id} mt={mt} mb={mb}>
      {title}
      <div ref={editorWrapperRef}>
        <div ref={wrapperRef} onClick={focus}>
          <DraftEditor
            ref={editorRef}
            editorState={editorState}
            onChange={setEditorState}
            readOnly={!isAuthor}
            {...props}
            keyBindingFn={keyBindingFn}
            handleKeyCommand={handleKeyCommand}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
      </div>
      <Box
        visibility={isAuthor ? 'visible' : 'hidden'}
        my={1}
        display={'flex'}
        alignItems={'center'}
      >
        <Box mr={1} onMouseDown={handleMouseDown}>
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
        <Box visibility={isValid ? 'hidden' : 'visible'}>
          <FormHelperText error>
            {isTooShort
              ? 'Text is too short'
              : isTooLong
              ? 'Text is too long'
              : 'Placeholder'}
          </FormHelperText>
        </Box>
      </Box>
    </IdeaSection>
  );
};

export const SectionEditor = React.forwardRef(SectionEditorWithRef);
