import Graph from 'graphology';
import { topologicalSort } from 'graphology-dag';

export type Connector = 'rectangle' | 'triangle' | 'semicircle' | 'stairs';

export type ComponentAttributes = {
  fill: string;
  input?: Connector;
};

export type ConnectionAttributes<Assembly extends string> = {
  assembly: Assembly;
};

export type StackedComponent = {
  name: string;
  fill: string;
  topConnector: Connector | undefined;
  bottomConnector: Connector | undefined;
};
export class ComponentGraph<Assembly extends string> {
  private readonly graph = new Graph<ComponentAttributes, ConnectionAttributes<Assembly>>({
    type: 'directed',
  });

  mergeEdge(source: string, target: string, attributes?: ConnectionAttributes<Assembly>) {
    this.graph.mergeEdge(source, target, attributes);
  }

  mergeNode(node: string, attributes: ComponentAttributes) {
    this.graph.mergeNode(node, attributes);
  }

  /**
   * @param graph
   * @returns the hexagon node if the graph is hexagonal, otherwise null
   */
  hexagon(): string | null {
    const nodesWithMoreThanTwoEdges = this.graph
      .nodes()
      .filter((node) => this.graph.degree(node) > 2);
    if (nodesWithMoreThanTwoEdges.length === 1) {
      return nodesWithMoreThanTwoEdges[0];
    } else {
      return null;
    }
  }

  /**
   * Converts an assembly graph into an array of stacked components.
   * The result can be rendered with StackedAssembly
   */
  toStackedComponents(assembly: Assembly): StackedComponent[] {
    const assemblyGraph = this.toAssemblyGraph(assembly);
    const componentNames = topologicalSort(assemblyGraph);
    const components: StackedComponent[] = componentNames.map((name) => {
      const { input: topConnector, fill } = assemblyGraph.getNodeAttributes(name);

      const outboundEdges = assemblyGraph.outboundEdges(name);
      if (outboundEdges.length > 1) {
        throw new Error(
          `Unexpected state - node ${name} has ${outboundEdges.length} outbound edges`,
        );
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

  /**
   * Reduces a component graph to an assembly graph
   * @param componentGraph the component graph
   * @param params the assembly to filter on
   * @returns a concrete assembly graph
   */
  private toAssemblyGraph(assembly: Assembly): Graph {
    return this.graph.reduceDirectedEdges<Graph>(
      (g, _edge, attributes, source, target, sourceAttributes, targetAttributes) => {
        if (attributes.assembly === assembly) {
          g.mergeEdge(source, target, attributes);
          g.mergeNode(source, sourceAttributes);
          g.mergeNode(target, targetAttributes);
        }
        return g;
      },
      new Graph({ type: 'directed' }),
    );
  }
}
