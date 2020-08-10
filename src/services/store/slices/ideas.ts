import { FirebaseError } from 'firebase/app';
import { User } from 'models/auth';
import { IdeaFilter, IdeaModel, IdeaSprout, IdeasState } from 'models/idea';
import { WithId } from 'models/models';
import { pipe, range } from 'ramda';
import { IndexRange } from 'react-virtualized';
import { createSelector } from 'reselect';
import {
  ActionType,
  createAction,
  createAsyncAction,
  getType,
} from 'typesafe-actions';
import { isIdea } from 'utils/idea/idea';

export const initialIdeasState: IdeasState = {
  ideas: [],
};

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
  (payload: Pick<IdeasState, 'ideas'> & Pick<IndexRange, 'startIndex'>) =>
    payload,
)();
export type CreateUpdateIdeas = typeof createUpdateIdeas;
export type UpdateIdeasAction = ReturnType<CreateUpdateIdeas>;

export const createUpdateIdea = createAction(
  'ideas/setOne',
  (payload: Partial<IdeaSprout> & WithId) => payload,
)();
export type CreateUpdateIdea = typeof createUpdateIdea;
export type SetIdeaAction = ReturnType<CreateUpdateIdea>;

export const createAddIdea = createAction(
  'ideas/add',
  (payload: IdeaSprout) => payload,
)();
export type CreateAddIdea = typeof createAddIdea;
export type AddIdeaAction = ReturnType<CreateAddIdea>;

export const createDeleteIdea = createAction(
  'ideas/delete',
  (payload: WithId) => payload,
)();
export type CreateDeleteIdea = typeof createDeleteIdea;
export type DeleteIdeaAction = ReturnType<CreateDeleteIdea>;

export interface FetchIdeasOptions
  extends IdeaFilter<keyof IdeaModel>,
    IndexRange {
  orderByField?: keyof IdeaModel;
  directionStr?: firebase.firestore.OrderByDirection;
}

export const fetchIdeasAsync = createAsyncAction(
  'ideas/fetch/request',
  'ideas/fetch/success',
  'ideas/fetch/failure',
)<FetchIdeasOptions, UpdateIdeasAction['payload'], FirebaseError>();
export type FetchIdeasAsync = typeof fetchIdeasAsync;
export type FetchIdeasRequest = ReturnType<FetchIdeasAsync['request']>;
export type FetchIdeasSuccess = ReturnType<FetchIdeasAsync['success']>;
export type FetchIdeasFailure = ReturnType<FetchIdeasAsync['failure']>;
export type FetchIdeasAction = ActionType<FetchIdeasAsync>;

export type IdeasAction =
  | UpdateIdeasAction
  | SetIdeasAction
  | ConcatIdeasAction
  | SetIdeaAction
  | AddIdeaAction
  | DeleteIdeaAction
  | FetchIdeasAction;

export const ideasSlice = (
  state = initialIdeasState,
  action: IdeasAction,
): IdeasState => {
  switch (action.type) {
    case getType(createSetIdeas):
      return { ...state, ideas: action.payload.ideas };
    case getType(createUpdateIdea):
      return {
        ...state,
        ideas: state.ideas.map((idea) =>
          isIdea(idea) && idea.id === action.payload.id
            ? { ...idea, ...action.payload }
            : idea,
        ),
      };
    case getType(createAddIdea):
      return {
        ...state,
        ideas: [action.payload, ...state.ideas].sort((a, b) =>
          !isIdea(a) || !isIdea(b)
            ? 0
            : a.createdAt.toMillis() > b.createdAt.toMillis()
            ? -1
            : 1,
        ),
      };
    case getType(createDeleteIdea):
      return {
        ...state,
        ideas: state.ideas.filter(
          (idea) => !isIdea(idea) || idea.id !== action.payload.id,
        ),
      };
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
          .concat(
            // * in case of an active subscription and a variable batch size
            // * for example: state.ideas.map((_, i) => i) === range(0, 29)
            // * batch: { startIndex: 10, ideas: ideas }; ideas.length === 10
            // * state.slice(0, 10).concat(ideas).concat(state.ideas.slice(20))
            state.ideas.slice(
              action.payload.startIndex + action.payload.ideas.length,
            ),
          ),
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

export const selectMyIdeas = (uid: User['uid']) =>
  pipe(
    selectIdeas,
    (ideas) =>
      ideas.filter(
        (idea) => isIdea(idea) && idea.author === uid,
      ) as IdeaSprout[],
  );
