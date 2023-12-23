import Graph from 'graphology';
import { topologicalSort } from 'graphology-dag';

export type Connector = 'rectangle' | 'triangle' | 'semicircle' | 'stairs';

export type ComponentAttributes = {
  fill: string;
};

export type ConnectionAttributes<Assembly extends string> = {
  assembly: Assembly;
  connector: Connector;
};

export type Component = {
  name: string;
  fill: string;
  inbound: Connector | null;
  outbound: Connector | null;
};

export type StackedAssembly = readonly Component[];

export type HexagonalAssembly = {
  inbound: readonly Component[];
  outbound: readonly Component[];
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

  toHexagonalAssembly(assembly: Assembly): HexagonalAssembly {
    const assemblyGraph = this.toAssemblyGraph(assembly);
    const hexagon = this.hexagon(assemblyGraph);
    if (hexagon === null) {
      throw new Error(`Could not determine hexagon node`);
    }

    const inboundEdges = assemblyGraph.inboundEdges(hexagon);
    const inbound: Component[] = inboundEdges.map((edge) => {
      const connector = assemblyGraph.getEdgeAttribute(edge, 'connector');
      const { fill } = assemblyGraph.getSourceAttributes(edge);
      const name = assemblyGraph.source(edge);
      const component: Component = {
        inbound: null,
        outbound: connector,
        name,
        fill,
      };
      return component;
    });

    const outboundEdges = assemblyGraph.outboundEdges(hexagon);
    const outbound: Component[] = outboundEdges.map((edge) => {
      const connector = assemblyGraph.getEdgeAttribute(edge, 'connector');
      const { fill } = assemblyGraph.getTargetAttributes(edge);
      const name = assemblyGraph.target(edge);
      const component: Component = {
        inbound: connector,
        outbound: null,
        name,
        fill,
      };
      return component;
    });

    return {
      inbound,
      outbound,
    };
  }

  /**
   * Converts an assembly graph into an array of stacked components.
   * The result can be rendered with StackedAssembly
   */
  toStackedAssembly(assembly: Assembly): StackedAssembly {
    const assemblyGraph = this.toAssemblyGraph(assembly);
    const componentNames = topologicalSort(assemblyGraph);
    const components: Component[] = componentNames.map((componentName) => {
      const outboundEdges = assemblyGraph.outboundEdges(componentName);
      if (outboundEdges.length > 1) {
        throw new Error(
          `Unexpected state - node ${componentName} has ${outboundEdges.length} outbound edges`,
        );
      }
      const inboundEdges = assemblyGraph.inboundEdges(componentName);
      if (inboundEdges.length > 1) {
        throw new Error(
          `Unexpected state - node ${componentName} has ${inboundEdges.length} inbound edges`,
        );
      }

      const inbound = inboundEdges[0]
        ? assemblyGraph.getEdgeAttribute(inboundEdges[0], 'connector')
        : null;
      const outbound = outboundEdges[0]
        ? assemblyGraph.getEdgeAttribute(outboundEdges[0], 'connector')
        : null;
      const fill = assemblyGraph.getNodeAttribute(componentName, 'fill') || null;
      const component: Component = {
        name: componentName,
        fill,
        inbound,
        outbound,
      };
      return component;
    });
    return components;
  }

  /**
   * @param graph
   * @returns the hexagon node if the graph is hexagonal, otherwise null
   */
  private hexagon(graph: Graph): string | null {
    const nodesWithMoreThanTwoEdges = graph.nodes().filter((node) => this.graph.degree(node) > 2);
    if (nodesWithMoreThanTwoEdges.length === 1) {
      return nodesWithMoreThanTwoEdges[0];
    } else {
      return null;
    }
  }

  /**
   * Reduces the graph to a smaller graph filtered on assembly
   *
   * @param assembly the assembly to filter on
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
