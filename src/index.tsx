import React from 'react';
import ReactDOM from 'react-dom';
import { preloadReady } from 'react-loadable';
import { App } from './App/App';
import './index.css';
import { WithPreloadedIdea } from './models/idea';
import * as serviceWorker from './serviceWorker';

if ((globalThis as typeof globalThis & WithPreloadedIdea).__PRELOADED_IDEA__) {
  globalThis.addEventListener('load', () => {
    preloadReady().then(() => {
      ReactDOM.hydrate(
        <React.StrictMode>
          <App />
        </React.StrictMode>,
        document.getElementById('root'),
      );
    });
  });
} else {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    globalThis.document.getElementById('root'),
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
