import type { Graphic } from 'svg-turtle';

import type { HexagonalAssembly } from '../ComponentGraph';
import { getConnectorPathConstructor } from './ConnectorPath';

export type HexagonalAssemblyDiagramParams = {
  unit: number;
  componentWidth: number;
  componentHeight: number;
};

export class HexagonalAssemblyDiagram {
  constructor(private readonly g: Graphic) {}

  draw(assembly: HexagonalAssembly, params: HexagonalAssemblyDiagramParams): Graphic {
    const { unit, componentWidth } = params;
    const edgePadding = componentWidth / 2;
    const connectorPadding = (componentWidth - 4) / 2;
    const g = this.g;

    const { inbound, outbound } = assembly;

    const inOutEdgeCount = Math.max(3, inbound.length, outbound.length);
    const edgeAngle = 180 / inOutEdgeCount;

    console.log({ inOutEdgeCount, edgeAngle });

    g.beginPath({ Color: 'red', Width: 4 });
    g.turnRight(edgeAngle);

    // Draw oubound
    for (let i = 0; i < inOutEdgeCount; i++) {
      g.draw(edgePadding * unit);
      const component = outbound[i];
      if (component === undefined) {
        g.draw(componentWidth * unit);
      } else if (component.inbound !== null) {
        const ConnectorPath = getConnectorPathConstructor(component.inbound);
        new ConnectorPath(g).draw({ unit, protrude: 'out', pad: connectorPadding });
      } else {
        throw new Error(`No inbound connector for component ${JSON.stringify(component, null, 2)}`);
      }
      g.draw(edgePadding * unit);

      g.turnLeft(edgeAngle);
    }

    // Draw inbound
    for (let i = 0; i < inOutEdgeCount; i++) {
      g.draw(edgePadding * unit);
      const component = inbound[i];
      if (component === undefined) {
        g.draw(componentWidth * unit);
      } else if (component.outbound !== null) {
        const ConnectorPath = getConnectorPathConstructor(component.outbound);
        new ConnectorPath(g).draw({ unit, protrude: 'out', pad: connectorPadding });
      } else {
        throw new Error(`No inbound connector for component ${JSON.stringify(component, null, 2)}`);
      }
      g.draw(edgePadding * unit);

      g.turnLeft(edgeAngle);
    }

    // for (let i = 0; i < assembly.length; i++) {
    //   if (i > 0) {
    //     g.move(componentHeight * unit).turnLeft(90);
    //   }
    //   const { outbound: bottomConnector, inbound: topConnector, fill } = assembly[i];
    //   g.beginPath({ Fill: fill, Color: 'black', Width: 4 });

    //   if (bottomConnector === null) {
    //     g.draw(componentWidth * unit);
    //   } else {
    //     const ConnectorPath = getConnectorPathConstructor(bottomConnector);
    //     new ConnectorPath(g).draw({ unit, protrude: 'in', pad: connectorPadding });
    //   }
    //   g.turnLeft(90);
    //   g.draw(componentHeight * unit);
    //   g.turnLeft(90);
    //   if (topConnector === null) {
    //     g.draw(componentWidth * unit);
    //   } else {
    //     const ConnectorPath = getConnectorPathConstructor(topConnector);
    //     new ConnectorPath(g).draw({ unit, protrude: 'out', pad: connectorPadding });
    //   }
    //   g.turnLeft(90);
    //   g.draw(componentHeight * unit);
    // }
    return g;
  }
}
