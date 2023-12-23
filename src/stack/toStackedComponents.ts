import { topologicalSort } from 'graphology-dag';

import type { Connector } from '../types';
import type { AssemblyGraph } from '../types';

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
export function toStackedComponents(assemblyGraph: AssemblyGraph): StackedComponent[] {
  const componentNames = topologicalSort(assemblyGraph);
  const components: StackedComponent[] = componentNames.map((name) => {
    const { input: topConnector, fill } = assemblyGraph.getNodeAttributes(name);

    const outboundEdges = assemblyGraph.outboundEdges(name);
    if (outboundEdges.length > 1) {
      throw new Error(`Unexpected state - node ${name} has ${outboundEdges.length} outbound edges`);
    }
    const { input: bottomConnector } =
      outboundEdges.length === 0
        ? { input: undefined }
        : assemblyGraph.getTargetAttributes(outboundEdges[0]);
    return {
      name,
      fill,
      topConnector,
      bottomConnector,
    };
  });
  return components;
}
