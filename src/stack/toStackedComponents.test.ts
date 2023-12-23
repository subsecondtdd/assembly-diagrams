import { describe, it } from 'vitest';

import { toAssemblyGraph } from '../toAssemblyGraph';
import { AssemblyGraph } from '../types';
import { toStackedComponents } from './toStackedComponents';

describe('toStackedComponents', () => {
  it('filters on assembly', () => {
    const componentGraph = new AssemblyGraph();

    componentGraph.mergeEdge('a', 'b', {
      assembly: 'production',
    });
    componentGraph.mergeEdge('a', 'c', {
      assembly: 'test',
    });

    const assemblyGraph = toAssemblyGraph(componentGraph, {
      assembly: 'test',
    });

    const components = toStackedComponents(assemblyGraph);
    console.log(components);
  });
});
