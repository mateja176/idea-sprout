import firebase, { FirebaseError } from 'firebase/app';
import { IdeaFilter, IdeaModel } from 'models';
import { range } from 'ramda';
import { IndexRange } from 'react-virtualized';
import { createSelector } from 'reselect';
import {
  ActionType,
  createAction,
  createAsyncAction,
  getType,
} from 'typesafe-actions';
import { FetchIdeasOptions } from '../thunks';

export class IdeaBatchError extends Error
  implements IndexRange, IdeaFilter<keyof IdeaModel> {
  name = 'IdeaBatchError';
  constructor(
    public message: string,
    public startIndex: number,
    public stopIndex: number,
    public fieldPath: keyof IdeaModel,
    public opStr: firebase.firestore.WhereFilterOp,
    public value: IdeaModel[keyof IdeaModel],
  ) {
    super(message);
  }
}

export interface IdeasState {
  total: number;
  ideas: Array<'loading' | IdeaModel | IdeaBatchError | undefined>;
}

export const initialIdeasState: IdeasState = {
  total: 1000,
  ideas: [],
};

export const createSetTotal = createAction(
  'ideas/total/set',
  (payload: Pick<IdeasState, 'total'>) => payload,
)();
export type CreateSetTotal = typeof createSetTotal;
export type SetTotalAction = ReturnType<CreateSetTotal>;

export const createSetIdeas = createAction(
  'ideas/set',
  (payload: Pick<IdeasState, 'ideas'>) => payload,
)();
export type CreateSetIdeas = typeof createSetIdeas;
export type SetIdeasAction = ReturnType<CreateSetIdeas>;

export const createConcatIdeas = createAction(
  'ideas/concat',
  (payload: Pick<IdeasState, 'ideas'>) => payload,
)();
export type CreateConcatIdeas = typeof createConcatIdeas;
export type ConcatIdeasAction = ReturnType<CreateConcatIdeas>;

export const createUpdateIdeas = createAction(
  'ideas/update',
  (payload: Pick<IdeasState, 'ideas'> & IndexRange) => payload,
)();
export type CreateUpdateIdeas = typeof createUpdateIdeas;
export type UpdateIdeasAction = ReturnType<CreateUpdateIdeas>;

export const fetchIdeasAsync = createAsyncAction(
  'ideas/fetch/request',
  'ideas/fetch/success',
  'ideas/fetch/failure',
)<
  FetchIdeasOptions<keyof IdeaModel>,
  UpdateIdeasAction['payload'],
  FirebaseError
>();
export type FetchIdeasAsync = typeof fetchIdeasAsync;
export type FetchIdeasRequest = ReturnType<FetchIdeasAsync['request']>;
export type FetchIdeasSuccess = ReturnType<FetchIdeasAsync['success']>;
export type FetchIdeasFailure = ReturnType<FetchIdeasAsync['failure']>;
export type FetchIdeasAction = ActionType<FetchIdeasAsync>;

export type IdeasAction =
  | SetTotalAction
  | UpdateIdeasAction
  | SetIdeasAction
  | ConcatIdeasAction
  | FetchIdeasAction;

export const ideasSlice = (
  state = initialIdeasState,
  action: IdeasAction,
): IdeasState => {
  switch (action.type) {
    case getType(createSetTotal):
      return { ...state, total: action.payload.total };
    case getType(createSetIdeas):
      return { ...state, ideas: action.payload.ideas };
    case getType(fetchIdeasAsync.request):
      return {
        ...state,
        ideas: state.ideas.concat(
          range(action.payload.startIndex, action.payload.stopIndex).map(
            () => 'loading',
          ),
        ),
      };
    case getType(createConcatIdeas):
      return { ...state, ideas: state.ideas.concat(action.payload.ideas) };
    case getType(fetchIdeasAsync.success):
    case getType(createUpdateIdeas):
      return {
        ...state,
        ideas: state.ideas
          .slice(0, action.payload.startIndex)
          .concat(action.payload.ideas)
          .concat(state.ideas.slice(action.payload.stopIndex)),
      };
    default:
      return state;
  }
};

export const selectIdeasSlice = ({ ideasSlice }: { ideasSlice: IdeasState }) =>
  ideasSlice;

export const selectIdeas = createSelector(
  selectIdeasSlice,
  ({ ideas }) => ideas,
);

export const selectTotal = createSelector(
  selectIdeasSlice,
  ({ total }) => total,
);
