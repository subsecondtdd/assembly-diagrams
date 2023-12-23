import fs from 'node:fs';
import { dirname } from 'node:path';

import { Graphic } from 'svg-turtle';
import { describe, expect, it } from 'vitest';

import { ComponentGraph } from './ComponentGraph';
import { StackedAssembly } from './rendering/StackedAssembly';

describe('ComponentGraph', () => {
  describe('.toStackedComponents', () => {
    it('filters on assembly', () => {
      const componentGraph = new ComponentGraph();

      componentGraph.mergeEdge('a', 'b', {
        assembly: 'production',
      });
      componentGraph.mergeEdge('a', 'c', {
        assembly: 'test',
      });

      const components = componentGraph.toStackedAssembly('test');
      expect(components.map(({ name }) => name)).toEqual(['a', 'c']);
    });

    describe('examples', () => {
      it('renders stacked assemblies', () => {
        const assemblies = ['production', 'tdd'] as const;
        type Assembly = (typeof assemblies)[number];

        const componentGraph = new ComponentGraph<Assembly>();
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

        for (const assembly of assemblies) {
          const productionAssembly = componentGraph.toStackedAssembly(assembly);
          const path = `assemblies/web/${assembly}.svg`;
          fs.mkdirSync(dirname(path), { recursive: true });
          fs.writeFileSync(
            path,
            new StackedAssembly(new Graphic()).draw(productionAssembly, stackParams).asSVG('px'),
          );
        }
      });
    });
  });

  describe('.hexagon', () => {
    it('returns the hexagon node when one node has more than 2 edges', () => {
      const componentGraph = new ComponentGraph();
      componentGraph.mergeEdge('a', 'hex');
      componentGraph.mergeEdge('b', 'hex');
      componentGraph.mergeEdge('hex', 'x');

      expect(componentGraph.hexagon()).toBe('hex');
    });

    it('returns null when no node has more than 2 edges', () => {
      const componentGraph = new ComponentGraph();
      componentGraph.mergeEdge('a', 'b');
      componentGraph.mergeEdge('b', 'c');
      componentGraph.mergeEdge('c', 'a');

      expect(componentGraph.hexagon()).toBe(null);
    });
  });
});
