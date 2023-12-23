import fs from 'node:fs';

import { Graphic } from 'svg-turtle';
import { describe, expect, it } from 'vitest';

import { StackedAssembly } from './StackedAssembly';
import { AssemblyGraph } from './types';

describe('assembly', () => {
  it('should be hexagonal when one node has more than 2 edges', () => {
    const graph = new AssemblyGraph({ type: 'directed' });
    graph.mergeEdge('a', 'hex');
    graph.mergeEdge('b', 'hex');
    graph.mergeEdge('hex', 'x');

    expect(hexagon(graph)).toBe('hex');
  });

  it('should not be hexagonal when no node has more than 2 edges', () => {
    const graph = new AssemblyGraph({ type: 'directed' });
    graph.mergeEdge('a', 'b');
    graph.mergeEdge('b', 'c');
    graph.mergeEdge('c', 'a');

    expect(hexagon(graph)).toBe(null);
  });

  describe('diagram', () => {
    it('should stack legos on top of each other', () => {
      const graph = new AssemblyGraph({ type: 'directed' });
      graph.mergeEdge('a', 'b');
      graph.mergeEdge('b', 'c');
      graph.mergeEdge('c', 'd');
      graph.mergeNode('a', {
        fill: 'orange',
      });
      graph.mergeNode('b', {
        fill: 'yellow',
      });
      graph.mergeNode('c', {
        fill: 'pink',
      });
      graph.mergeNode('d', {
        fill: 'cyan',
      });
      const stack = new StackedAssembly(graph);

      const g = new Graphic();
      // g.beginPath({ Fill: 'pink', Color: 'red', Width: 4 });
      stack.draw(g);
      const svg = g.asSVG('px');
      fs.writeFileSync('assemblies/web.svg', svg);
    });
  });
});

/**
 * @param graph
 * @returns the hexagon node if the graph is hexagonal, otherwise null
 */
function hexagon(graph: AssemblyGraph): string | null {
  const nodesWithMoreThanTwoEdges = graph.nodes().filter((node) => graph.degree(node) > 2);
  if (nodesWithMoreThanTwoEdges.length === 1) {
    return nodesWithMoreThanTwoEdges[0];
  } else {
    return null;
  }
}
