import { describe, it } from 'vitest';

import { ComponentGraph } from '../types';

describe('toStackedComponents', () => {
  it('filters on assembly', () => {
    const componentGraph = new ComponentGraph();

    componentGraph.mergeEdge('a', 'b', {
      assembly: 'production',
    });
    componentGraph.mergeEdge('a', 'c', {
      assembly: 'test',
    });

    const components = componentGraph.toStackedComponents('test');
    console.log(components);
  });
});
