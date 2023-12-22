import fs from 'node:fs';

import Graph from 'graphology';
import { topologicalSort } from 'graphology-dag';
import { Graphic } from 'svg-turtle';
import { describe, expect, it } from 'vitest';

import type { ConnectorConstructor } from './assembly';
import { SemicircleConnector, StairsConnector, TriangleConnector } from './assembly';
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

      const componentNames = topologicalSort(graph);

      const connectors = [
        undefined,
        TriangleConnector,
        SemicircleConnector,
        StairsConnector,
        undefined,
      ];
      const fills = ['pink', 'yellow', 'orange', 'cyan'];
      const stackedComponents: StackedComponent[] = componentNames.map((name, i) => ({
        name,
        fill: fills[i],
        topConnector: connectors[i],
        bottomConnector: connectors[i + 1],
      }));
      const stack = new Stack(stackedComponents);

      const g = new Graphic();
      // g.beginPath({ Fill: 'pink', Color: 'red', Width: 4 });
      stack.draw(g);
      const svg = g.asSVG('px');
      console.log(svg);
      fs.writeFileSync('assemblies/web.svg', svg);
    });
  });
});

type StackedComponent = {
  name: string;
  fill: string;
  topConnector: ConnectorConstructor | undefined;
  bottomConnector: ConnectorConstructor | undefined;
};

class Stack {
  private readonly unit = 10;
  private readonly componentWidth = 16;
  private readonly componentHeight = 7;
  private readonly connectorPadding = (this.componentWidth - 4) / 2;

  constructor(private readonly components: StackedComponent[]) {}

  draw(g: Graphic): Graphic {
    for (let i = 0; i < this.components.length; i++) {
      if (i > 0) {
        g.move(this.componentHeight * this.unit).turnLeft(90);
      }
      const { bottomConnector, topConnector, fill } = this.components[i];
      g.beginPath({ Fill: fill, Color: 'black', Width: 4 });

      if (bottomConnector === undefined) {
        g.draw(this.componentWidth * this.unit);
      } else {
        new bottomConnector(g, this.unit).draw('in', this.connectorPadding);
      }
      g.turnLeft(90);
      g.draw(this.componentHeight * this.unit);
      g.turnLeft(90);
      if (topConnector === undefined) {
        g.draw(this.componentWidth * this.unit);
      } else {
        new topConnector(g, this.unit).draw('out', this.connectorPadding);
      }
      g.turnLeft(90);
      g.draw(this.componentHeight * this.unit);
    }
    return g;
  }
}

function hexagon(graph: Graph): string | null {
  const nodesWithMoreThanTwoEdges = graph.nodes().filter((node) => graph.degree(node) > 2);
  if (nodesWithMoreThanTwoEdges.length === 1) {
    return nodesWithMoreThanTwoEdges[0];
  } else {
    return null;
  }
}
