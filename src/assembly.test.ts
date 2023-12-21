import fs from 'node:fs';

import Graph from 'graphology';
import { topologicalSort } from 'graphology-dag';
import { Graphic } from 'svg-turtle';
import { describe, expect, it } from 'vitest';

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

      const sorted = topologicalSort(graph);

      const stack = new Stack(sorted);

      const g = new Graphic();
      g.beginPath({ Fill: 'pink', Color: 'red', Width: 4 });
      stack.draw(g);
      const svg = g.asSVG('px');
      console.log(svg);
      fs.writeFileSync('assemblies/web.svg', svg);
    });
  });
});

class Stack {
  private readonly unit = 10;
  private readonly componentWidth = 14;
  private readonly componentHeight = 7;
  constructor(public readonly components: string[]) {}

  draw(g: Graphic): Graphic {
    new TriangleConnector(g, this.unit).draw('in', 5);
    g.turnLeft(90);
    g.draw(this.componentHeight * this.unit);
    g.turnLeft(90);
    g.draw(this.componentWidth * this.unit);
    g.turnLeft(90);
    g.draw(this.componentHeight * this.unit);

    g.move(this.componentHeight * this.unit).turnLeft(90);
    new SemicircleConnector(g, this.unit).draw('in', 5);
    g.turnLeft(90);
    g.draw(this.componentHeight * this.unit);
    g.turnLeft(90);
    new TriangleConnector(g, this.unit).draw('out', 5);
    g.turnLeft(90);
    g.draw(this.componentHeight * this.unit);

    g.move(this.componentHeight * this.unit).turnLeft(90);
    new StairsConnector(g, this.unit).draw('in', 5);
    g.turnLeft(90);
    g.draw(this.componentHeight * this.unit);
    g.turnLeft(90);
    new SemicircleConnector(g, this.unit).draw('out', 5);
    g.turnLeft(90);
    g.draw(this.componentHeight * this.unit);

    g.move(this.componentHeight * this.unit).turnLeft(90);
    g.draw(this.componentWidth * this.unit);
    g.turnLeft(90);
    g.draw(this.componentHeight * this.unit);
    g.turnLeft(90);
    new StairsConnector(g, this.unit).draw('out', 5);
    g.turnLeft(90);
    g.draw(this.componentHeight * this.unit);

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
