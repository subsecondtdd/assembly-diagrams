import fs from 'node:fs';

import Graph from 'graphology';
import { Graphic } from 'svg-turtle';
import { describe, expect, it } from 'vitest';

import { StackedAssembly } from './StackedAssembly';

describe('assembly', () => {
  it('should be hexagonal when one node has more than 2 edges', () => {
    const graph = new Graph({ type: 'directed' });
    graph.mergeEdge('a', 'hex');
    graph.mergeEdge('b', 'hex');
    graph.mergeEdge('hex', 'x');

    expect(hexagon(graph)).toBe('hex');
  });

  it('should not be hexagonal when no node has more than 2 edges', () => {
    const graph = new Graph({ type: 'directed' });
    graph.mergeEdge('a', 'b');
    graph.mergeEdge('b', 'c');
    graph.mergeEdge('c', 'a');

    expect(hexagon(graph)).toBe(null);
  });

  describe('diagram', () => {
    it('should stack legos on top of each other', () => {
      const graph = new Graph({ type: 'directed' });
      graph.mergeEdge('a', 'b');
      graph.mergeEdge('b', 'c');
      graph.mergeEdge('c', 'd');
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
function hexagon(graph: Graph): string | null {
  const nodesWithMoreThanTwoEdges = graph.nodes().filter((node) => graph.degree(node) > 2);
  if (nodesWithMoreThanTwoEdges.length === 1) {
    return nodesWithMoreThanTwoEdges[0];
  } else {
    return null;
  }
}
