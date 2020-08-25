import React from 'react';
import ReactDOM from 'react-dom';
import { preloadReady } from 'react-loadable';
import { App } from './App/App';
import { initialPreloadContext, PreloadContext } from './context/preload';
import './index.css';
import { WithPreloaded } from './models/idea';
import * as serviceWorker from './serviceWorker';

if ('preloaded' in globalThis) {
  const preloadedValue = {
    ...initialPreloadContext,
    ...(globalThis as typeof globalThis & WithPreloaded).preloaded,
  };

  globalThis.addEventListener('load', () => {
    preloadReady().then(() => {
      ReactDOM.hydrate(
        <PreloadContext.Provider value={preloadedValue}>
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </PreloadContext.Provider>,
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
