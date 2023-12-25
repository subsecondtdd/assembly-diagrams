import type { Graphic } from 'svg-turtle';

import type { StackedAssembly } from '../ComponentGraph';
import { ComponentRenderer } from './ComponentRenderer';

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
      const component = assembly[i];
      new ComponentRenderer(g).draw(component, {
        componentHeight,
        componentWidth,
        unit,
        connectorPadding,
      });
    }
    return g;
  }
}
