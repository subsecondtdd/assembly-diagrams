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
      graph.mergeEdge('spa', 'fetch', {
        assembly: 'production',
      });
      graph.mergeEdge('fetch', 'http', {
        assembly: 'production',
      });
      graph.mergeEdge('http', 'webserver', {
        assembly: 'production',
      });
      graph.mergeEdge('webserver', 'fetchhandler', {
        assembly: 'production',
      });

      graph.mergeNode('spa', {
        fill: 'orange',
      });
      graph.mergeNode('fetch', {
        fill: 'yellow',
        input: 'semicircle',
      });
      graph.mergeNode('http', {
        fill: 'pink',
        input: 'triangle',
      });
      graph.mergeNode('webserver', {
        fill: 'cyan',
        input: 'rectangle',
      });
      graph.mergeNode('fetchhandler', {
        fill: 'lightgreen',
        input: 'semicircle',
      });
      const stack = new StackedAssembly(graph);

      const g = stack.draw(new Graphic());
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
