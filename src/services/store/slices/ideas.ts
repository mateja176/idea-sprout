import { OrderedMap } from 'immutable';
import { IdeaModel, RawIdea } from 'models';
import { createSelector } from 'reselect';
import { createAction, getType } from 'typesafe-actions';

export interface IdeasState {
  ideas: OrderedMap<IdeaModel['id'], RawIdea>;
}

export const initialIdeasState: IdeasState = {
  ideas: OrderedMap(),
};

export const createConcatIdeas = createAction(
  'ideas/concat',
  (payload: IdeasState['ideas']) => payload,
)();
export type CreateAddIdeas = typeof createConcatIdeas;
export type ConcatIdeasAction = ReturnType<CreateAddIdeas>;

export type IdeasAction = ConcatIdeasAction;

export const ideasSlice = (
  state = initialIdeasState,
  action: IdeasAction,
): IdeasState => {
  switch (action.type) {
    case getType(createConcatIdeas):
      return { ...state, ideas: state.ideas.merge(action.payload) };
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
