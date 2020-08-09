import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createEpicMiddleware } from 'redux-observable';
import { epic } from './epic';
import { promiseMiddleware } from './middleware/promisedAction';
import { Action, reducer, State } from './reducer';

const epicMiddleware = createEpicMiddleware<Action, Action, State>();

export const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(promiseMiddleware, epicMiddleware)),
);

epicMiddleware.run(epic);
