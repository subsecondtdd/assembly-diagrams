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

describe('System', () => {
  describe('.toHexagonalAssembly', () => {
    it('creates a 3-connector hexagon', () => {
      const system = new System<'production'>();

      system.addConnection({
        source: 'app',
        target: 'email',
        assembly: 'production',
      });
      system.addConnection({
        source: 'app',
        target: 'payment',
        assembly: 'production',
      });
      system.addConnection({
        source: 'api-client',
        target: 'app',
        assembly: 'production',
      });
      system.addConnection({
        source: 'hypermedia-client',
        target: 'app',
        assembly: 'production',
      });
      system.addComponent({
        name: 'app',
        fill: 'pink',
        inbound: [],
        outbound: ['semicircle'],
      });
      system.addComponent({
        name: 'email',
        fill: 'red',
        inbound: ['semicircle'],
        outbound: [],
      });
      system.addComponent({
        name: 'payment',
        fill: 'blue',
        inbound: ['triangle'],
        outbound: [],
      });
      system.addComponent({
        name: 'api-client',
        fill: 'green',
        inbound: [],
        outbound: ['rectangle'],
      });
      system.addComponent({
        name: 'hypermedia-client',
        fill: 'purple',
        inbound: [],
        outbound: ['stairs'],
      });

      const hexagonalAssembly = system.toHexagonalAssembly('production');
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
    it('fails when a component is not defined', () => {
      const system = new System<'production'>();

      system.addConnection({
        source: 'a',
        target: 'b',
        assembly: 'production',
      });

      expect(() => system.toStackedAssembly('production')).toThrow(
        'Component a is missing the inbound attribute. Is it defined?',
      );
    });

    it('fails when two adjacent components have incompatible connectors', () => {
      const system = new System<'production'>();

      system.addConnection({
        source: 'a',
        target: 'b',
        assembly: 'production',
      });

      system.addComponent({
        name: 'a',
        fill: 'red',
        inbound: [],
        outbound: ['semicircle'],
      });
      system.addComponent({
        name: 'b',
        fill: 'blue',
        inbound: ['triangle'],
        outbound: [],
      });

      expect(() => system.toStackedAssembly('production')).toThrow(
        'Component a--semicircle--> is incompatible with --triangle-->b',
      );
    });

    it('filters on assembly', () => {
      const system = new System();

      system.addConnection({
        source: 'a',
        target: 'b',
        assembly: 'production',
      });
      system.addConnection({
        source: 'a',
        target: 'c',
        assembly: 'test',
      });
      system.addComponent({
        name: 'a',
        fill: 'red',
        inbound: [],
        outbound: ['semicircle'],
      });
      system.addComponent({
        name: 'b',
        fill: 'blue',
        inbound: ['semicircle'],
        outbound: [],
      });
      system.addComponent({
        name: 'c',
        fill: 'green',
        inbound: ['semicircle'],
        outbound: [],
      });

      const components = system.toStackedAssembly('test');
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

        const system = new System<Assembly>();
        system.addConnection({
          source: 'spa',
          target: 'fetch',
          assembly: 'production',
        });
        system.addConnection({
          source: 'fetch',
          target: 'http',
          assembly: 'production',
        });
        system.addConnection({
          source: 'http',
          target: 'webserver',
          assembly: 'production',
        });
        system.addConnection({
          source: 'webserver',
          target: 'fetchhandler',
          assembly: 'production',
        });
        system.addConnection({
          source: 'spa',
          target: 'fetchhandler',
          assembly: 'tdd',
        });

        system.addComponent({
          name: 'spa',
          fill: 'orange',
          inbound: [],
          outbound: ['semicircle'],
        });
        system.addComponent({
          name: 'fetch',
          fill: 'yellow',
          inbound: ['semicircle'],
          outbound: ['triangle'],
        });
        system.addComponent({
          name: 'http',
          fill: 'pink',
          inbound: ['triangle'],
          outbound: ['rectangle'],
        });
        system.addComponent({
          name: 'webserver',
          fill: 'cyan',
          inbound: ['rectangle'],
          outbound: ['semicircle'],
        });
        system.addComponent({
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
          const productionAssembly = system.toStackedAssembly(assembly);
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
