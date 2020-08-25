/// <reference types="react-scripts" />
/// <reference types="react" />
/// <reference path="../../src/global.d.ts" />

import { ServerStyleSheets, ThemeProvider } from '@material-ui/core';
import * as cheerio from 'cheerio';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import 'firebase/auth';
import * as fs from 'fs-extra';
import { join } from 'path';
import qs from 'querystring';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import Loadable from 'react-loadable';
import { StaticRouter } from 'react-router-dom';
import * as url from 'url';
import assetManifest from '../../build/asset-manifest.json';
import { App } from '../../src/App/App';
import { EnvContext } from '../../src/context/env';
import { PreloadContext } from '../../src/context/preload';
import type { RawIdea } from '../../src/models/idea';
import theme from '../../src/utils/styles/theme';
import * as models from './models/models';

const getFileUrl = (path: string) =>
  url
    .format({
      protocol: 'https',
      hostname: 'firebasestorage.googleapis.com',
      pathname: join(
        'v0/b/idea-sprout.appspot.com/o',
        encodeURIComponent(path),
      ),
      search: qs.stringify({ alt: 'media' }),
    })
    .toString();

export const renderIdea = functions.https.onRequest(async (req, res) => {
  const {
    config: firebase,
    paypal,
    log_rocket,
    drift,
  } = functions.config() as models.Config;

  const [, ideaId] = req.path.match(/\/ideas\/([\w\d]+)/) || [];

  if (!ideaId) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid idea id');
  }

  try {
    const ideaData = (
      await admin.firestore().collection('ideas').doc(ideaId).get()
    ).data() as RawIdea;

    if (!ideaData) {
      return res.redirect('/ideas');
    }

    const logoUrl: string = getFileUrl(ideaData.logo.path);

    const ideaUrl = url
      .format({
        protocol: req.protocol,
        hostname: req.hostname,
        pathname: req.path,
      })
      .toString();

    const indexPath = join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'build',
      'index.html',
    );
    const indexHTML = await fs.readFile(indexPath, { encoding: 'utf-8' });

    const modules: string[] = [];

    const idea = { ...ideaData, id: ideaId };

    const sheets = new ServerStyleSheets();

    await Loadable.preloadAll();

    const app = ReactDOMServer.renderToString(
      sheets.collect(
        <Loadable.Capture
          report={(moduleName: string) => modules.push(moduleName)}
        >
          <StaticRouter location={{ pathname: req.path, state: { idea } }}>
            <ThemeProvider theme={theme}>
              <EnvContext.Provider
                value={{
                  firebaseApiKey: firebase.api_key,
                  firebaseAuthDomain: firebase.auth_domain,
                  firebaseDatabaseUrl: firebase.database_url,
                  firebaseProjectId: firebase.project_id,
                  firebaseStorageBucket: firebase.storage_bucket,
                  firebaseMessagingSenderId: firebase.messaging_sender_id,
                  firebaseAppId: firebase.app_id,
                  firebaseMeasurementId: firebase.measurement_id,
                  paypalClientId: paypal.client,
                  logRocketId: log_rocket.id,
                  driftId: drift.id,
                }}
              >
                <PreloadContext.Provider
                  value={{
                    hasWindow: false,
                    ideaUrl,
                    logoUrl,
                    storyUrl: getFileUrl(ideaData.story.path),
                    imageUrls: ideaData.images.map((image) =>
                      getFileUrl(image.path),
                    ),
                  }}
                >
                  <App />
                </PreloadContext.Provider>
              </EnvContext.Provider>
            </ThemeProvider>
          </StaticRouter>
        </Loadable.Capture>,
      ),
    );

    const $ = cheerio.load(indexHTML);

    const css = sheets.toString();
    $('head').append(`<style id="jss-server-side">${css}</style>`);

    $('meta[name="description"]').attr('content', ideaData.tagline);
    $('title').html(ideaData.name);
    $('link[rel="icon"]').attr('href', logoUrl);
    $('meta[name="twitter:image"]').attr('property', logoUrl);
    $('meta[property="og:image"]').attr('content', logoUrl);
    $('meta[property="og:url"]').attr('content', ideaUrl);
    $('meta[property="og:title"]').attr('content', ideaData.name);
    $('meta[property="og:description"]').attr('content', ideaData.tagline);

    $('#root').after(
      `<script>window.__PRELOADED_IDEA__ = ${JSON.stringify(idea)}</script>`,
    );

    modules
      .map((moduleName) => moduleName.match(/\w+$/)?.[0])
      .map((name) => `${name}.js`)
      .map(
        (key) =>
          assetManifest.files[key as keyof typeof assetManifest['files']],
      )
      .forEach((src) => {
        $('#root').after(`<script src="${src}" data-src="${src}"></script>`);
      });

    $('#root').append(app);

    res.set('cache-control', 'public, max-age=300, s-maxage=600');

    res.send($.html());
  } catch (error) {
    console.error('error:', error);
    res.redirect('/ideas');
  }
});
