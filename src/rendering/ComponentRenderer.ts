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

    if (outbound.length === 0) {
      g.draw(componentWidth * unit);
    } else if (outbound.length === 1) {
      const ConnectorPath = getConnectorPathConstructor(outbound[0]);
      new ConnectorPath(g).draw({ unit, protrude: 'out', pad: connectorPadding });
    } else {
      throw new Error(`Component ${component.name} has more than one outbound connector`);
    }
    g.turnLeft(90);
    g.draw(componentHeight * unit);
    g.turnLeft(90);
    if (inbound.length === 0) {
      g.draw(componentWidth * unit);
    } else if (inbound.length === 1) {
      const ConnectorPath = getConnectorPathConstructor(inbound[0]);
      new ConnectorPath(g).draw({ unit, protrude: 'in', pad: connectorPadding });
    } else {
      throw new Error(`Component ${component.name} has more than one inbound connector`);
    }
    g.turnLeft(90);
    g.draw(componentHeight * unit);

    g.turnLeft(180);
    g.move((componentHeight / 2) * unit);
    g.turnRight(90);
    g.move((componentWidth / 2) * unit);
    // text

    g.text(component.name);

    g.turnLeft(180);
    g.move((componentWidth / 2) * unit);
    g.turnLeft(90);
    g.move((componentHeight / 2) * unit);
  }
}
