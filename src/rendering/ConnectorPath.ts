import type { Graphic } from 'svg-turtle';

import type { Connector } from '../ComponentGraph';

type Protrude = 'in' | 'out';
type Curve = 'curveLeft' | 'curveRight';
type Turn = 'turnLeft' | 'turnRight';

function turns(protrude: Protrude): [Turn, Turn] {
  const turnLeft = protrude === 'in' ? 'turnLeft' : 'turnRight';
  const turnRight = protrude === 'in' ? 'turnRight' : 'turnLeft';
  return [turnLeft, turnRight];
}

function curves(protrude: Protrude): [Curve, Curve] {
  const curveLeft = protrude === 'in' ? 'curveLeft' : 'curveRight';
  const curveRight = protrude === 'in' ? 'curveRight' : 'curveLeft';
  return [curveLeft, curveRight];
}

type Params = {
  unit: number;
  protrude: Protrude;

  /**
   * padding (in units) on each side of the connector
   */
  pad: number;
};

export abstract class ConnectorPath {
  constructor(protected readonly g: Graphic) {}

  /**
   * Draws a connector. A connector fits in a recangle of width 4*unit and height 2*unit.
   */
  abstract draw(params: Params): Graphic;
}

export type ConnectorPathConstructor = new (g: Graphic) => ConnectorPath;

export function getConnectorPathConstructor(connector: Connector): ConnectorPathConstructor {
  switch (connector) {
    case 'rectangle':
      return RectanglePath;
    case 'semicircle':
      return SemicirclePath;
    case 'stairs':
      return StairsPath;
    case 'triangle':
      return TrianglePath;
    default:
      throw new Error(`Unsupported connector: ${connector}`);
  }
}

export class RectanglePath extends ConnectorPath {
  draw(params: Params) {
    const { protrude, unit, pad } = params;
    const [turnLeft, turnRight] = turns(protrude);
    return this.g
      .draw(pad * unit)
      [turnLeft](90)
      .draw(2 * unit)
      [turnRight](90)
      .draw(4 * unit)
      [turnRight](90)
      .draw(2 * unit)
      [turnLeft](90)
      .draw(pad * unit);
  }
}

export class TrianglePath extends ConnectorPath {
  draw(params: Params) {
    const { protrude, unit, pad } = params;
    const [turnLeft, turnRight] = turns(protrude);
    return this.g
      .draw(pad * unit)
      [turnLeft](45)
      .draw(2 * unit * Math.sqrt(2))
      [turnRight](90)
      .draw(2 * unit * Math.sqrt(2))
      [turnLeft](45)
      .draw(pad * unit);
  }
}

export class StairsPath extends ConnectorPath {
  draw(params: Params) {
    const { protrude, unit, pad } = params;
    const [turnLeft, turnRight] = turns(protrude);
    return this.g
      .draw(pad * unit)
      [turnLeft](90)
      .draw(unit)
      [turnRight](90)
      .draw(unit)
      [turnLeft](90)
      .draw(unit)
      [turnRight](90)
      .draw(unit * 2)
      [turnRight](90)
      .draw(unit)
      [turnLeft](90)
      .draw(unit)
      [turnRight](90)
      .draw(unit)
      [turnLeft](90)
      .draw(pad * unit);
  }
}

export class SemicirclePath extends ConnectorPath {
  draw(params: Params) {
    const { protrude, unit, pad } = params;
    const [turnLeft] = turns(protrude);
    const [, curveRight] = curves(protrude);
    return this.g
      .draw(pad * unit)
      [turnLeft](90)
      [curveRight](180, 2 * unit)
      [turnLeft](90)
      .draw(pad * unit);
  }
}
