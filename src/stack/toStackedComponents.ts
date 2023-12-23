import { topologicalSort } from 'graphology-dag';

import {
  type ConnectorPathConstructor,
  getConnectorPathConstructor,
} from '../rendering/ConnectorPath';
import type { AssemblyGraph } from '../types';

type StackedComponent = {
  name: string;
  fill: string;
  topConnector: ConnectorPathConstructor | undefined;
  bottomConnector: ConnectorPathConstructor | undefined;
};

export function toStackedComponents(graph: AssemblyGraph): StackedComponent[] {
  const componentNames = topologicalSort(graph);
  const components: StackedComponent[] = componentNames.map((name) => {
    const { input, fill } = graph.getNodeAttributes(name);
    const topConnector = getConnectorPathConstructor(input);

    const outboundEdges = graph.outboundEdges(name);
    if (outboundEdges.length > 1) {
      throw new Error(`Unexpected state - node ${name} has ${outboundEdges.length} outbound edges`);
    }
    const { input: outboundInput } =
      outboundEdges.length === 0
        ? { input: undefined }
        : graph.getTargetAttributes(outboundEdges[0]);
    const bottomConnector = getConnectorPathConstructor(outboundInput);
    return {
      name,
      fill,
      topConnector,
      bottomConnector,
    };
  });
  return components;
}
