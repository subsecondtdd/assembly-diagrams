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
    const { unit, componentWidth, componentHeight } = params;
    const edgePadding = componentWidth / 4;
    const connectorPadding = (componentWidth - 4) / 2;
    const g = this.g;

    const { inbound, outbound } = assembly;

    const inOutEdgeCount = Math.max(3, inbound.length, outbound.length);
    const edgeAngle = 180 / inOutEdgeCount;

    console.log({ inOutEdgeCount, edgeAngle });

    g.beginPath({ Fill: 'white', Color: 'black', Width: 4 });
    g.turnRight(edgeAngle);

    for (let i = 0; i < inOutEdgeCount * 2; i++) {
      const outboundComponent = i < inOutEdgeCount;

      const component = outboundComponent ? outbound[i] : inbound[i - inOutEdgeCount];
      if (component === undefined) {
        g.draw((edgePadding + componentWidth + edgePadding) * unit);
        g.turnLeft(edgeAngle);
        continue;
      }
      const connector = outboundComponent ? component.inbound : component.outbound;
      if (connector === null) {
        throw new Error(
          `No ${
            outboundComponent ? 'inbound' : 'outbound'
          } connector for component ${JSON.stringify(component, null, 2)}`,
        );
      }
      g.draw(edgePadding * unit);
      const ConnectorPath = getConnectorPathConstructor(connector);
      const protrude = outboundComponent ? 'out' : 'in';
      new ConnectorPath(g).draw({ unit, protrude, pad: connectorPadding });
      g.draw(edgePadding * unit);
      g.turnLeft(edgeAngle);
    }

    for (let i = 0; i < inOutEdgeCount * 2; i++) {
      const outboundComponent = i < inOutEdgeCount;
      const component = outboundComponent ? outbound[i] : inbound[i - inOutEdgeCount];
      if (component === undefined) {
        g.move((edgePadding + componentWidth + edgePadding) * unit);
        g.turnLeft(edgeAngle);
        continue;
      }
      const connector = outboundComponent ? component.inbound : component.outbound;
      if (connector === null) {
        throw new Error(
          `No ${
            outboundComponent ? 'inbound' : 'outbound'
          } connector for component ${JSON.stringify(component, null, 2)}`,
        );
      }
      g.beginPath({ Fill: component.fill, Color: 'black', Width: 4 });
      const ConnectorPath = getConnectorPathConstructor(connector);
      g.move(edgePadding * unit);
      g.turnRight(90);
      g.draw(componentHeight * unit);
      g.turnLeft(90);
      g.draw(componentWidth * unit);
      g.turnLeft(90);
      g.draw(componentHeight * unit);
      g.turnLeft(90);
      const protrude = outboundComponent ? 'in' : 'out';
      new ConnectorPath(g).draw({ unit, protrude, pad: connectorPadding });
      g.turnLeft(180);
      g.move((componentWidth + edgePadding) * unit);
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
