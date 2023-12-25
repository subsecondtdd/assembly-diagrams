import fs from 'node:fs';
import { dirname } from 'node:path';

import { Graphic } from 'svg-turtle';
import { describe, expect, it } from 'vitest';

import type { Component, StackedAssembly } from './ComponentGraph';
import { ComponentGraph } from './ComponentGraph';
import type { HexagonalAssemblyDiagramParams } from './rendering/HexagonalAssemblyDiagram';
import { HexagonalAssemblyDiagram } from './rendering/HexagonalAssemblyDiagram';
import type { StackedAssemblyDiagramParams } from './rendering/StackedAssemblyDiagram';
import { StackedAssemblyDiagram } from './rendering/StackedAssemblyDiagram';

describe('ComponentGraph', () => {
  describe('.toHexagonalAssembly', () => {
    it('creates a 3-connector hexagon', () => {
      const componentGraph = new ComponentGraph<'production'>();

      componentGraph.mergeEdge('app', 'email', {
        connector: 'semicircle',
        assembly: 'production',
      });
      componentGraph.mergeEdge('app', 'payment', {
        connector: 'triangle',
        assembly: 'production',
      });
      componentGraph.mergeEdge('api-client', 'app', {
        connector: 'rectangle',
        assembly: 'production',
      });
      componentGraph.mergeEdge('hypermedia-client', 'app', {
        connector: 'stairs',
        assembly: 'production',
      });
      componentGraph.mergeNode('app', {
        fill: 'pink',
      });
      componentGraph.mergeNode('email', {
        fill: 'red',
      });
      componentGraph.mergeNode('payment', {
        fill: 'blue',
      });
      componentGraph.mergeNode('api-client', {
        fill: 'green',
      });
      componentGraph.mergeNode('hypermedia-client', {
        fill: 'purple',
      });

      const hexagonalAssembly = componentGraph.toHexagonalAssembly('production');
      const { inbound, outbound } = hexagonalAssembly;

      const expectedInbound: Component[] = [
        {
          name: 'api-client',
          inbound: null,
          fill: 'green',
          outbound: 'rectangle',
        },
        {
          name: 'hypermedia-client',
          inbound: null,
          fill: 'purple',
          outbound: 'stairs',
        },
      ];
      expect(inbound).toEqual(expectedInbound);

      const expectedOutbound: Component[] = [
        {
          name: 'email',
          inbound: 'semicircle',
          fill: 'red',
          outbound: null,
        },
        {
          name: 'payment',
          inbound: 'triangle',
          fill: 'blue',
          outbound: null,
        },
      ];
      expect(outbound).toEqual(expectedOutbound);

      const params: HexagonalAssemblyDiagramParams = {
        unit: 10,
        componentWidth: 16,
        componentHeight: 8,
      };

      const svg = new HexagonalAssemblyDiagram(new Graphic())
        .draw(hexagonalAssembly, params)
        .asSVG('px');

      const path = `assemblies/ecommerce/hexagonal.svg`;
      fs.mkdirSync(dirname(path), { recursive: true });
      fs.writeFileSync(path, svg);
    });
  });

  describe('.toStackedComponents', () => {
    it('filters on assembly', () => {
      const componentGraph = new ComponentGraph();

      componentGraph.mergeEdge('a', 'b', {
        connector: 'semicircle',
        assembly: 'production',
      });
      componentGraph.mergeEdge('a', 'c', {
        connector: 'semicircle',
        assembly: 'test',
      });
      componentGraph.mergeNode('a', {
        fill: 'red',
      });
      componentGraph.mergeNode('b', {
        fill: 'blue',
      });
      componentGraph.mergeNode('c', {
        fill: 'green',
      });

      const components = componentGraph.toStackedAssembly('test');
      const expected: StackedAssembly = [
        {
          name: 'a',
          inbound: null,
          fill: 'red',
          outbound: 'semicircle',
        },
        {
          name: 'c',
          inbound: 'semicircle',
          fill: 'green',
          outbound: null,
        },
      ];
      expect(components).toEqual(expected);
    });

    describe('examples', () => {
      it('renders stacked assemblies', () => {
        const assemblies = ['production', 'tdd'] as const;
        type Assembly = (typeof assemblies)[number];

        const componentGraph = new ComponentGraph<Assembly>();
        componentGraph.mergeEdge('spa', 'fetch', {
          connector: 'semicircle',
          assembly: 'production',
        });
        componentGraph.mergeEdge('fetch', 'http', {
          connector: 'triangle',
          assembly: 'production',
        });
        componentGraph.mergeEdge('http', 'webserver', {
          connector: 'rectangle',
          assembly: 'production',
        });
        componentGraph.mergeEdge('webserver', 'fetchhandler', {
          connector: 'stairs',
          assembly: 'production',
        });
        componentGraph.mergeEdge('spa', 'fetchhandler', {
          connector: 'semicircle',
          assembly: 'tdd',
        });

        componentGraph.mergeNode('spa', {
          fill: 'orange',
        });
        componentGraph.mergeNode('fetch', {
          fill: 'yellow',
        });
        componentGraph.mergeNode('http', {
          fill: 'pink',
        });
        componentGraph.mergeNode('webserver', {
          fill: 'cyan',
        });
        componentGraph.mergeNode('fetchhandler', {
          fill: 'lightgreen',
        });

        const params: StackedAssemblyDiagramParams = {
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
            new StackedAssemblyDiagram(new Graphic()).draw(productionAssembly, params).asSVG('px'),
          );
        }
      });
    });
  });

  // describe('.hexagon', () => {
  //   it('returns the hexagon node when one node has more than 2 edges', () => {
  //     const componentGraph = new ComponentGraph();
  //     componentGraph.mergeEdge('a', 'hex');
  //     componentGraph.mergeEdge('b', 'hex');
  //     componentGraph.mergeEdge('hex', 'x');

  //     expect(componentGraph.hexagon()).toBe('hex');
  //   });

  //   it('returns null when no node has more than 2 edges', () => {
  //     const componentGraph = new ComponentGraph();
  //     componentGraph.mergeEdge('a', 'b');
  //     componentGraph.mergeEdge('b', 'c');
  //     componentGraph.mergeEdge('c', 'a');

  //     expect(componentGraph.hexagon()).toBe(null);
  //   });
  // });
});
