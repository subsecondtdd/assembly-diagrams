import fs from 'node:fs';
import { dirname } from 'node:path';

import { describe, expect, it } from 'vitest';

import type { Component, StackedAssembly } from './ComponentGraph';
import { System } from './ComponentGraph';
import type { HexagonalAssemblyDiagramParams } from './rendering/HexagonalAssemblyDiagram';
import { HexagonalAssemblyDiagram } from './rendering/HexagonalAssemblyDiagram';
import type { StackedAssemblyDiagramParams } from './rendering/StackedAssemblyDiagram';
import { StackedAssemblyDiagram } from './rendering/StackedAssemblyDiagram';
import { Graphic } from './rendering/svg-turtle';

describe('ComponentGraph', () => {
  describe('.toHexagonalAssembly', () => {
    it('creates a 3-connector hexagon', () => {
      const componentGraph = new System<'production'>();

      componentGraph.addConnection({
        source: 'app',
        target: 'email',
        assembly: 'production',
      });
      componentGraph.addConnection({
        source: 'app',
        target: 'payment',
        assembly: 'production',
      });
      componentGraph.addConnection({
        source: 'api-client',
        target: 'app',
        assembly: 'production',
      });
      componentGraph.addConnection({
        source: 'hypermedia-client',
        target: 'app',
        assembly: 'production',
      });
      componentGraph.addComponent({
        name: 'app',
        fill: 'pink',
        inbound: [],
        outbound: ['semicircle'],
      });
      componentGraph.addComponent({
        name: 'email',
        fill: 'red',
        inbound: ['semicircle'],
        outbound: [],
      });
      componentGraph.addComponent({
        name: 'payment',
        fill: 'blue',
        inbound: ['triangle'],
        outbound: [],
      });
      componentGraph.addComponent({
        name: 'api-client',
        fill: 'green',
        inbound: [],
        outbound: ['rectangle'],
      });
      componentGraph.addComponent({
        name: 'hypermedia-client',
        fill: 'purple',
        inbound: [],
        outbound: ['stairs'],
      });

      const hexagonalAssembly = componentGraph.toHexagonalAssembly('production');
      const { inboundComponents: inbound, outboundComponents: outbound } = hexagonalAssembly;

      const expectedInbound: Component[] = [
        {
          name: 'api-client',
          fill: 'green',
          inbound: [],
          outbound: ['rectangle'],
        },
        {
          name: 'hypermedia-client',
          fill: 'purple',
          inbound: [],
          outbound: ['stairs'],
        },
      ];
      expect(inbound).toEqual(expectedInbound);

      const expectedOutbound: Component[] = [
        {
          name: 'email',
          fill: 'red',
          inbound: ['semicircle'],
          outbound: [],
        },
        {
          name: 'payment',
          fill: 'blue',
          inbound: ['triangle'],
          outbound: [],
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
      const componentGraph = new System();

      componentGraph.addConnection({
        source: 'a',
        target: 'b',
        assembly: 'production',
      });
      componentGraph.addConnection({
        source: 'a',
        target: 'c',
        assembly: 'test',
      });
      componentGraph.addComponent({
        name: 'a',
        fill: 'red',
        inbound: [],
        outbound: ['semicircle'],
      });
      componentGraph.addComponent({
        name: 'b',
        fill: 'blue',
        inbound: ['semicircle'],
        outbound: [],
      });
      componentGraph.addComponent({
        name: 'c',
        fill: 'green',
        inbound: ['semicircle'],
        outbound: [],
      });

      const components = componentGraph.toStackedAssembly('test');
      const expected: StackedAssembly = [
        {
          name: 'a',
          fill: 'red',
          inbound: [],
          outbound: ['semicircle'],
        },
        {
          name: 'c',
          fill: 'green',
          inbound: ['semicircle'],
          outbound: [],
        },
      ];
      expect(components).toEqual(expected);
    });

    describe('examples', () => {
      it('renders stacked assemblies', () => {
        const assemblies = ['production', 'tdd'] as const;
        type Assembly = (typeof assemblies)[number];

        const componentGraph = new System<Assembly>();
        componentGraph.addConnection({
          source: 'spa',
          target: 'fetch',
          assembly: 'production',
        });
        componentGraph.addConnection({
          source: 'fetch',
          target: 'http',
          assembly: 'production',
        });
        componentGraph.addConnection({
          source: 'http',
          target: 'webserver',
          assembly: 'production',
        });
        componentGraph.addConnection({
          source: 'webserver',
          target: 'fetchhandler',
          assembly: 'production',
        });
        componentGraph.addConnection({
          source: 'spa',
          target: 'fetchhandler',
          assembly: 'tdd',
        });

        componentGraph.addComponent({
          name: 'spa',
          fill: 'orange',
          inbound: [],
          outbound: ['semicircle'],
        });
        componentGraph.addComponent({
          name: 'fetch',
          fill: 'yellow',
          inbound: ['semicircle'],
          outbound: ['triangle'],
        });
        componentGraph.addComponent({
          name: 'http',
          fill: 'pink',
          inbound: ['triangle'],
          outbound: ['rectangle'],
        });
        componentGraph.addComponent({
          name: 'webserver',
          fill: 'cyan',
          inbound: ['rectangle'],
          outbound: ['semicircle'],
        });
        componentGraph.addComponent({
          name: 'fetchhandler',
          fill: 'lightgreen',
          inbound: ['semicircle'],
          outbound: [],
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
});
