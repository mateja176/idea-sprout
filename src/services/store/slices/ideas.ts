import firebase from 'firebase/app';
import { IdeaFilter, IdeaModel } from 'models';
import { IndexRange } from 'react-virtualized';
import { createSelector } from 'reselect';
import { createAction, getType } from 'typesafe-actions';

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

export type IdeasAction =
  | SetTotalAction
  | UpdateIdeasAction
  | SetIdeasAction
  | ConcatIdeasAction;

export const ideasSlice = (
  state = initialIdeasState,
  action: IdeasAction,
): IdeasState => {
  switch (action.type) {
    case getType(createSetTotal):
      return { ...state, total: action.payload.total };
    case getType(createSetIdeas):
      return { ...state, ideas: action.payload.ideas };
    case getType(createConcatIdeas):
      return { ...state, ideas: state.ideas.concat(action.payload.ideas) };
    case getType(createUpdateIdeas):
      return {
        ...state,
        ideas: state.ideas
          .map((idea, i) =>
            i >= action.payload.startIndex && i < action.payload.stopIndex
              ? action.payload.ideas[action.payload.startIndex + i]
              : idea,
          )
          .filter(Boolean),
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
