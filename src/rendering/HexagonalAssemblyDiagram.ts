import type { HexagonalAssembly } from '../ComponentGraph';
import { ComponentRenderer } from './ComponentRenderer';
import { getConnectorPathConstructor } from './ConnectorPath';
import type { Graphic } from './svg-turtle';

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

    const { inboundComponents: inbound, outboundComponents: outbound } = assembly;

    const inOutEdgeCount = Math.max(3, inbound.length, outbound.length);
    const edgeAngle = 180 / inOutEdgeCount;

    g.beginPath({ Fill: 'white', Color: 'black', Width: 4 });
    g.turnRight(edgeAngle);
    if (inOutEdgeCount % 2 === 0) {
      // To make sure there is always an angle on the horizontal line
      g.turnRight(edgeAngle / 2);
    }

    for (let i = 0; i < inOutEdgeCount * 2; i++) {
      const outboundComponent = i < inOutEdgeCount;

      const component = outboundComponent ? outbound[i] : inbound[i - inOutEdgeCount];
      if (component === undefined) {
        g.draw((edgePadding + componentWidth + edgePadding) * unit);
        g.turnLeft(edgeAngle);
        continue;
      }
      const connectors = outboundComponent ? component.inbound : component.outbound;
      if (connectors.length !== 1) {
        throw new Error(
          `Expected exactly 1 ${
            outboundComponent ? 'inbound' : 'outbound'
          } connector count for component ${JSON.stringify(component, null, 2)}`,
        );
      }
      g.draw(edgePadding * unit);
      const ConnectorPath = getConnectorPathConstructor(connectors[0]);
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
      g.move(edgePadding * unit);

      if (outboundComponent) {
        g.turnRight(90);
        g.move(componentHeight * unit);
        g.turnLeft(90);
      } else {
        g.move(componentWidth * unit);
        g.turnLeft(180);
      }

      new ComponentRenderer(g).draw(component, {
        componentHeight,
        componentWidth,
        unit,
        connectorPadding,
      });
      if (outboundComponent) {
        g.turnLeft(90);
        g.move(componentWidth * unit);
        g.turnLeft(90);
        g.move(componentHeight * unit);
        g.turnRight(90);
      } else {
        g.turnRight(90);
      }

      g.move(edgePadding * unit);
      g.turnLeft(edgeAngle);
    }
    return g;
  }
}
