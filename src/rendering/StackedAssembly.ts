import type { Graphic } from 'svg-turtle';

import type { Component } from '../ComponentGraph';
import { getConnectorPathConstructor } from './ConnectorPath';

type Params = {
  unit: number;
  componentWidth: number;
  componentHeight: number;
};

export class StackedAssembly {
  constructor(private readonly g: Graphic) {}

  draw(components: readonly Component[], params: Params): Graphic {
    const { unit, componentWidth, componentHeight } = params;
    const connectorPadding = (componentWidth - 4) / 2;
    const g = this.g;

    for (let i = 0; i < components.length; i++) {
      if (i > 0) {
        g.move(componentHeight * unit).turnLeft(90);
      }
      const { bottomConnector, topConnector, fill } = components[i];
      g.beginPath({ Fill: fill, Color: 'black', Width: 4 });

      if (bottomConnector === undefined) {
        g.draw(componentWidth * unit);
      } else {
        const ConnectorPath = getConnectorPathConstructor(bottomConnector);
        new ConnectorPath(g).draw({ unit, protrude: 'in', pad: connectorPadding });
      }
      g.turnLeft(90);
      g.draw(componentHeight * unit);
      g.turnLeft(90);
      if (topConnector === undefined) {
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
