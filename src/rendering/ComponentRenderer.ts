import type { Component } from '../ComponentGraph';
import { getConnectorPathConstructor } from './ConnectorPath';
import type { Graphic } from './svg-turtle';

export type ComponentRendererParams = {
  unit: number;
  componentWidth: number;
  componentHeight: number;
  connectorPadding: number;
};

export class ComponentRenderer {
  constructor(private readonly g: Graphic) {}

  draw(component: Component, params: ComponentRendererParams) {
    const { unit, componentWidth, componentHeight, connectorPadding } = params;

    const g = this.g;

    const { outbound, inbound, fill } = component;
    g.beginPath({ Fill: fill, Color: 'black', Width: 4 });

    if (outbound === null) {
      g.draw(componentWidth * unit);
    } else {
      const ConnectorPath = getConnectorPathConstructor(outbound);
      new ConnectorPath(g).draw({ unit, protrude: 'out', pad: connectorPadding });
    }
    g.turnLeft(90);
    g.draw(componentHeight * unit);
    g.turnLeft(90);
    if (inbound === null) {
      g.draw(componentWidth * unit);
    } else {
      const ConnectorPath = getConnectorPathConstructor(inbound);
      new ConnectorPath(g).draw({ unit, protrude: 'in', pad: connectorPadding });
    }
    g.turnLeft(90);
    g.draw(componentHeight * unit);
  }
}
