import type { Graphic } from 'svg-turtle';

import type { Connector } from '../types';

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

export abstract class ConnectorPath {
  constructor(
    protected readonly g: Graphic,
    protected readonly unit: number,
  ) {}
  /**
   * Draws a connector. A connector fits in a recangle of width 4*unit and height 2*unit.
   *
   * @param protrude - 'in' or 'out'
   * @param pad - padding (in units) on each side of the connector
   */
  abstract draw(protrude: Protrude, pad: number): Graphic;
}

export type ConnectorPathConstructor = new (g: Graphic, unit: number) => ConnectorPath;

export function getConnectorPathConstructor(
  connector: Connector | undefined,
): ConnectorPathConstructor | undefined {
  if (connector === undefined) {
    return undefined;
  }
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
  draw(protrude: Protrude, pad: number) {
    const [turnLeft, turnRight] = turns(protrude);
    return this.g
      .draw(pad * this.unit)
      [turnLeft](90)
      .draw(2 * this.unit)
      [turnRight](90)
      .draw(4 * this.unit)
      [turnRight](90)
      .draw(2 * this.unit)
      [turnLeft](90)
      .draw(pad * this.unit);
  }
}

export class TrianglePath extends ConnectorPath {
  draw(protrude: Protrude, pad: number) {
    const [turnLeft, turnRight] = turns(protrude);
    return this.g
      .draw(pad * this.unit)
      [turnLeft](45)
      .draw(2 * this.unit * Math.sqrt(2))
      [turnRight](90)
      .draw(2 * this.unit * Math.sqrt(2))
      [turnLeft](45)
      .draw(pad * this.unit);
  }
}

export class StairsPath extends ConnectorPath {
  draw(protrude: Protrude, pad: number) {
    const [turnLeft, turnRight] = turns(protrude);
    return this.g
      .draw(pad * this.unit)
      [turnLeft](90)
      .draw(this.unit)
      [turnRight](90)
      .draw(this.unit)
      [turnLeft](90)
      .draw(this.unit)
      [turnRight](90)
      .draw(this.unit * 2)
      [turnRight](90)
      .draw(this.unit)
      [turnLeft](90)
      .draw(this.unit)
      [turnRight](90)
      .draw(this.unit)
      [turnLeft](90)
      .draw(pad * this.unit);
  }
}

export class SemicirclePath extends ConnectorPath {
  draw(protrude: Protrude, pad: number) {
    const [turnLeft] = turns(protrude);
    const [, curveRight] = curves(protrude);
    return this.g
      .draw(pad * this.unit)
      [turnLeft](90)
      [curveRight](180, 2 * this.unit)
      [turnLeft](90)
      .draw(pad * this.unit);
  }
}
