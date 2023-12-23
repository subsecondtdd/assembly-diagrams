import { AssemblyGraph } from './types';

type Params = {
  assembly: string;
};

/**
 * Reduces a full component graph to an assembly graph
 * @param graph the full graph
 * @param params the assembly to filter on
 * @returns a concrete assembly graph
 */
export function toAssemblyGraph(graph: AssemblyGraph, params: Params): AssemblyGraph {
  return graph.reduceDirectedEdges<AssemblyGraph>(
    (g, _edge, attributes, source, target, sourceAttributes, targetAttributes) => {
      if (attributes.assembly === params.assembly) {
        g.mergeEdge(source, target, attributes);
        g.mergeNode(source, sourceAttributes);
        g.mergeNode(target, targetAttributes);
      }
      return g;
    },
    new AssemblyGraph(),
  );
}
