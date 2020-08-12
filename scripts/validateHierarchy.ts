import * as fs from 'fs';
import { join } from 'path';
import * as ts from 'typescript';

const getErrorMessage = ({
  path,
  parentPath,
  source,
}: {
  path: string;
  parentPath: string;
  source: string;
}) =>
  `Since ${path} is part of "${parentPath}", it cannot contain an import from "${source}".`;

const topLevelPaths = [
  'models',
  'utils',
  'elements',
  'components',
  'context',
  'services',
  'hooks',
  'containers',
  'App',
] as const;
type TopLevelPaths = typeof topLevelPaths;
type TopLevelPath = TopLevelPaths[number];

const additionalPaths = ['react'] as const;

const knownPaths = [...topLevelPaths, ...additionalPaths];
type KnownPaths = typeof knownPaths;
type KnownPath = KnownPaths[number];

const constraints: Record<TopLevelPath, { disallowed: KnownPath[] }> = {
  models: {
    disallowed: knownPaths.filter((path) => !['models'].includes(path)),
  },
  utils: {
    disallowed: knownPaths.filter(
      (path) => !['models', 'utils'].includes(path),
    ),
  },
  elements: {
    disallowed: knownPaths.filter(
      (path) => !['react', 'models', 'utils', 'elements'].includes(path),
    ),
  },
  components: {
    disallowed: knownPaths.filter(
      (path) =>
        !['react', 'models', 'utils', 'elements', 'components'].includes(path),
    ),
  },
  context: {
    disallowed: knownPaths.filter(
      (path) => !['react', 'models', 'utils', 'context'].includes(path),
    ),
  },
  services: {
    disallowed: knownPaths.filter(
      (path) => !['models', 'utils', 'services'].includes(path),
    ),
  },
  hooks: {
    disallowed: ['containers', 'App'],
  },
  containers: {
    disallowed: ['App'],
  },
  App: {
    disallowed: [],
  },
};

const [, , rootPath] = process.argv;

const fullRootPath = join(__dirname, '..', rootPath);

const validateHierarchy = (rootPath: string) =>
  fs.readdirSync(rootPath).forEach((path) => {
    const fullPath = join(rootPath, path);

    fs.lstat(fullPath, (err, stats) => {
      if (!err) {
        if (stats.isDirectory()) {
          validateHierarchy(fullPath);
        } else if (path.endsWith('.ts') || path.endsWith('.tsx')) {
          fs.readFile(fullPath, { encoding: 'utf8' }, (err, content) => {
            if (!err) {
              const file = ts.createSourceFile(
                path,
                content,
                ts.ScriptTarget.Latest,
              );

              file.forEachChild((child) => {
                if (ts.isImportDeclaration(child)) {
                  const source: string = (child.moduleSpecifier as any).text;

                  const topLevelParent = fullPath
                    .split(fullRootPath)[1]
                    .split('/')[1];

                  Object.entries(constraints).forEach(
                    ([topLevelFolder, { disallowed }]) => {
                      if (
                        topLevelParent === topLevelFolder &&
                        disallowed.includes(source as KnownPath)
                      ) {
                        console.log(
                          getErrorMessage({
                            path: fullPath,
                            parentPath: topLevelParent,
                            source,
                          }),
                        );
                      }
                    },
                  );
                }
              });
            }
          });
        }
      }
    });
  });

validateHierarchy(fullRootPath);
