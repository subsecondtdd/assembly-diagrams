import type { Graphic } from 'svg-turtle';

import type { StackedAssembly } from '../ComponentGraph';
import { getConnectorPathConstructor } from './ConnectorPath';

export type StackedAssemblyDiagramParams = {
  unit: number;
  componentWidth: number;
  componentHeight: number;
};

export class StackedAssemblyDiagram {
  constructor(private readonly g: Graphic) {}

  draw(assembly: StackedAssembly, params: StackedAssemblyDiagramParams): Graphic {
    const { unit, componentWidth, componentHeight } = params;
    const connectorPadding = (componentWidth - 4) / 2;
    const g = this.g;

    for (let i = 0; i < assembly.length; i++) {
      if (i > 0) {
        g.move(componentHeight * unit).turnLeft(90);
      }
      const { outbound: bottomConnector, inbound: topConnector, fill } = assembly[i];
      g.beginPath({ Fill: fill, Color: 'black', Width: 4 });

      if (bottomConnector === null) {
        g.draw(componentWidth * unit);
      } else {
        const ConnectorPath = getConnectorPathConstructor(bottomConnector);
        new ConnectorPath(g).draw({ unit, protrude: 'in', pad: connectorPadding });
      }
      g.turnLeft(90);
      g.draw(componentHeight * unit);
      g.turnLeft(90);
      if (topConnector === null) {
        g.draw(componentWidth * unit);
      } else {
        const ConnectorPath = getConnectorPathConstructor(topConnector);
        new ConnectorPath(g).draw({ unit, protrude: 'out', pad: connectorPadding });
      }
      g.turnLeft(90);
      g.draw(componentHeight * unit);
    }
    return g;
  }
}
