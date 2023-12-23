import type { Graphic } from 'svg-turtle';

import { toStackedComponents } from '../stack/toStackedComponents';
import type { AssemblyGraph } from '../types';

export class StackedAssembly {
  private readonly unit = 10;
  private readonly componentWidth = 16;
  private readonly componentHeight = 7;
  private readonly connectorPadding = (this.componentWidth - 4) / 2;

  constructor(private readonly graph: AssemblyGraph) {}

  draw(g: Graphic): Graphic {
    const graph = this.graph;

    const components = toStackedComponents(graph);

    for (let i = 0; i < components.length; i++) {
      if (i > 0) {
        g.move(this.componentHeight * this.unit).turnLeft(90);
      }
      const { bottomConnector, topConnector, fill } = components[i];
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
