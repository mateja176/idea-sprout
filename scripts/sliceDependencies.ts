import { MadgeResult } from 'madge';

const madge = require('madge');

const [, , path, dependency] = process.argv;

type Tree = Record<string, string[]>;

const merge = <A extends Tree, B extends Tree>(a: A, b: B) =>
  [...Object.entries(a), ...Object.entries(b)].reduce(
    (merged, [key, value]) => ({
      ...merged,
      [key]: merged[key]
        ? Array.from(new Set(merged[key].concat(value)))
        : value,
    }),
    {} as { [key in keyof A | keyof B]: string[] },
  );

const sliceDependencies = (
  result: MadgeResult,
  dependencyPath: string,
  tree: Tree,
) => {
  const dependants: string[] = result.depends(dependencyPath);

  return dependants.reduce(
    (newTree, dependant) =>
      merge(
        {
          ...newTree,
          [dependant]: newTree[dependant]
            ? newTree[dependant].concat(dependencyPath)
            : [dependencyPath],
        },
        sliceDependencies(result, dependant, {}),
      ),
    tree,
  );
};

madge(path, { fileExtensions: ['ts', 'tsx'] }).then((result) => {
  const tree = sliceDependencies(result, dependency, { [dependency]: [] });

  result.tree = tree;

  console.log(JSON.stringify(tree));

  result.image('graph.svg');
});
