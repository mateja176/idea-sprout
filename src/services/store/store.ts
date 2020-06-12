import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createEpicMiddleware } from 'redux-observable';
import { epic } from './epic';
import { reducer } from './reducer';

const epicMiddleware = createEpicMiddleware();

export const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(epicMiddleware)),
);

epicMiddleware.run(epic);
