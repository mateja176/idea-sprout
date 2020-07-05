import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createEpicMiddleware } from 'redux-observable';
import thunkMiddleware from 'redux-thunk';
import { epic } from './epic';
import { promiseMiddleware } from './middleware';
import { Action, reducer, State } from './reducer';

const epicMiddleware = createEpicMiddleware<Action, Action, State>();

export const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(promiseMiddleware, epicMiddleware, thunkMiddleware),
  ),
);

epicMiddleware.run(epic);
