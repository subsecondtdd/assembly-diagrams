import { topologicalSort } from 'graphology-dag';

import type { AssemblyGraph, Connector } from '../types';

export type StackedComponent = {
  name: string;
  fill: string;
  topConnector: Connector | undefined;
  bottomConnector: Connector | undefined;
};

/**
 * Converts an assembly graph into an array of stacked components.
 * The result can be rendered with StackedAssembly
 */
export function toStackedComponents(graph: AssemblyGraph): StackedComponent[] {
  const componentNames = topologicalSort(graph);
  const components: StackedComponent[] = componentNames.map((name) => {
    const { input: topConnector, fill } = graph.getNodeAttributes(name);

    const outboundEdges = graph.outboundEdges(name);
    if (outboundEdges.length > 1) {
      throw new Error(`Unexpected state - node ${name} has ${outboundEdges.length} outbound edges`);
    }
    const { input: bottomConnector } =
      outboundEdges.length === 0
        ? { input: undefined }
        : graph.getTargetAttributes(outboundEdges[0]);
    return {
      name,
      fill,
      topConnector,
      bottomConnector,
    };
  });
  return components;
}
