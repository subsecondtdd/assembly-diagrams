import type Graph from 'graphology';
import { topologicalSort } from 'graphology-dag';
import type { Graphic } from 'svg-turtle';

import {
  type ConnectorConstructor,
  SemicircleConnector,
  StairsConnector,
  TriangleConnector,
} from './Connector';

type StackedComponent = {
  name: string;
  fill: string;
  topConnector: ConnectorConstructor | undefined;
  bottomConnector: ConnectorConstructor | undefined;
};

export class StackedAssembly {
  private readonly unit = 10;
  private readonly componentWidth = 16;
  private readonly componentHeight = 7;
  private readonly connectorPadding = (this.componentWidth - 4) / 2;
  private readonly components: StackedComponent[];

  constructor(graph: Graph) {
    const componentNames = topologicalSort(graph);
    const connectors = [
      undefined,
      TriangleConnector,
      SemicircleConnector,
      StairsConnector,
      undefined,
    ];
    const fills = ['pink', 'yellow', 'orange', 'cyan'];
    this.components = componentNames.map((name, i) => ({
      name,
      fill: fills[i],
      topConnector: connectors[i],
      bottomConnector: connectors[i + 1],
    }));
  }

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
