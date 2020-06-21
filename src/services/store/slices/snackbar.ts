import { ISnackbar } from 'models';
import { createAction, getType } from 'typesafe-actions';

export interface SnackbarState {
  queue: Array<
    Omit<ISnackbar, 'autoHideDuration'> & {
      autoHideDuration: NonNullable<ISnackbar['autoHideDuration']>;
    }
  >;
}

export const initialSnackbarState: SnackbarState = {
  queue: [],
};

export const createQueueSnackbar = createAction(
  'snackbar/queue',
  ({ autoHideDuration, ...payload }: ISnackbar) => ({
    ...payload,
    autoHideDuration: autoHideDuration || 5000,
  }),
)();
export type CreateQueueSnackbar = typeof createQueueSnackbar;
export type QueueSnackbarAction = ReturnType<CreateQueueSnackbar>;

export const createCloseSnackbar = createAction('snackbar/close')();
export type CreateCloseSnackbar = typeof createCloseSnackbar;
export type CloseSnackbarAction = ReturnType<CreateCloseSnackbar>;

export type SnackbarAction = QueueSnackbarAction | CloseSnackbarAction;

export const snackbar = (
  state = initialSnackbarState,
  action: SnackbarAction,
): SnackbarState => {
  switch (action.type) {
    case getType(createQueueSnackbar):
      return { ...state, queue: state.queue.concat(action.payload) };

    case getType(createCloseSnackbar):
      const [_, ...queue] = state.queue; // eslint-disable-line @typescript-eslint/no-unused-vars
      return { ...state, queue };

    default:
      return state;
  }
};
