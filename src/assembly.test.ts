import fs from 'node:fs';

import { Graphic } from 'svg-turtle';
import { describe, expect, it } from 'vitest';

import { ComponentGraph } from './ComponentGraph';
import { StackedAssembly } from './rendering/StackedAssembly';

describe('assembly', () => {
  it('should be hexagonal when one node has more than 2 edges', () => {
    const componentGraph = new ComponentGraph();
    componentGraph.mergeEdge('a', 'hex');
    componentGraph.mergeEdge('b', 'hex');
    componentGraph.mergeEdge('hex', 'x');

    expect(componentGraph.hexagon()).toBe('hex');
  });

  it('should not be hexagonal when no node has more than 2 edges', () => {
    const componentGraph = new ComponentGraph();
    componentGraph.mergeEdge('a', 'b');
    componentGraph.mergeEdge('b', 'c');
    componentGraph.mergeEdge('c', 'a');

    expect(componentGraph.hexagon()).toBe(null);
  });

  describe('diagram', () => {
    it('should stack legos on top of each other', () => {
      const componentGraph = new ComponentGraph();
      componentGraph.mergeEdge('spa', 'fetch', {
        assembly: 'production',
      });
      componentGraph.mergeEdge('fetch', 'http', {
        assembly: 'production',
      });
      componentGraph.mergeEdge('http', 'webserver', {
        assembly: 'production',
      });
      componentGraph.mergeEdge('webserver', 'fetchhandler', {
        assembly: 'production',
      });
      componentGraph.mergeEdge('spa', 'fetchhandler', {
        assembly: 'tdd',
      });

      componentGraph.mergeNode('spa', {
        fill: 'orange',
      });
      componentGraph.mergeNode('fetch', {
        fill: 'yellow',
        input: 'semicircle',
      });
      componentGraph.mergeNode('http', {
        fill: 'pink',
        input: 'triangle',
      });
      componentGraph.mergeNode('webserver', {
        fill: 'cyan',
        input: 'rectangle',
      });
      componentGraph.mergeNode('fetchhandler', {
        fill: 'lightgreen',
        input: 'semicircle',
      });

      const stackParams = {
        unit: 10,
        componentWidth: 16,
        componentHeight: 8,
      };
      fs.writeFileSync(
        'assemblies/web.svg',
        new StackedAssembly(new Graphic())
          .draw(componentGraph.toStackedComponents('production'), stackParams)
          .asSVG('px'),
      );
    });
  });
});
