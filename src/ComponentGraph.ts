import Graph from 'graphology';
import { topologicalSort } from 'graphology-dag';

export type Connector = 'rectangle' | 'triangle' | 'semicircle' | 'stairs';

export type Connection<Assembly extends string> = {
  source: string;
  target: string;
  assembly: Assembly;
};

export type Component = {
  name: string;
  fill: string;
  inbound: readonly Connector[];
  outbound: readonly Connector[];
};

export type StackedAssembly = readonly Component[];

export type HexagonalAssembly = {
  inboundComponents: readonly Component[];
  outboundComponents: readonly Component[];
};

type ComponentGraph<Assembly extends string> = Graph<Omit<Component, 'name'>, Connection<Assembly>>;

export class System<Assembly extends string> {
  private readonly graph: ComponentGraph<Assembly> = new Graph<Component, Connection<Assembly>>({
    type: 'directed',
  });

  addConnection(connection: Connection<Assembly>) {
    const { source, target, ...attributes } = connection;
    this.graph.mergeEdge(source, target, attributes);
  }

  addComponent(component: Component) {
    const { name, ...attributes } = component;
    this.graph.mergeNode(name, attributes);
  }

  toHexagonalAssembly(assembly: Assembly): HexagonalAssembly {
    const assemblyGraph = this.toAssemblyGraph(assembly);
    const hexagon = this.hexagon(assemblyGraph);
    if (hexagon === null) {
      throw new Error(`Could not determine hexagon core node`);
    }

    const inboundComponents: Component[] = assemblyGraph
      .inboundEdges(hexagon)
      .map((inboundEdge) => ({
        name: assemblyGraph.source(inboundEdge),
        ...assemblyGraph.getSourceAttributes(inboundEdge),
      }));

    const outboundComponents: Component[] = assemblyGraph
      .outboundEdges(hexagon)
      .map((inboundEdge) => ({
        name: assemblyGraph.target(inboundEdge),
        ...assemblyGraph.getTargetAttributes(inboundEdge),
      }));

    return {
      inboundComponents,
      outboundComponents,
    };
  }

  /**
   * Converts an assembly graph into an array of stacked components.
   * The result can be rendered with StackedAssembly
   */
  toStackedAssembly(assembly: Assembly): StackedAssembly {
    const assemblyGraph = this.toAssemblyGraph(assembly);
    const componentNames = topologicalSort(assemblyGraph);
    let previousComponent: Component | undefined = undefined;
    return componentNames.map((name) => {
      const { inbound, outbound, fill } = assemblyGraph.getNodeAttributes(name);
      if (inbound === undefined) {
        throw new Error(`Component ${name} is missing the inbound attribute. Is it defined?`);
      }
      if (outbound === undefined) {
        throw new Error(`Component ${name} is missing the outbound attribute. Is it defined?`);
      }
      if (fill === undefined) {
        throw new Error(`Component ${name} is missing the fill attribute. Is it defined?`);
      }
      if (inbound.length > 1) {
        throw new Error(`Component ${name} has more than one inbound connector: ${inbound}`);
      }
      if (outbound.length > 1) {
        throw new Error(`Component ${name} has more than one outbound connector: ${outbound}`);
      }
      if (previousComponent !== undefined) {
        // Check that the outbound connector of the previous component matches the inbound connector of this component
        const previousOutboundConnector = previousComponent.outbound[0];
        if (previousOutboundConnector === undefined) {
          throw new Error(`Component ${previousComponent.name} has no outbound connector`);
        }
        const inboundConnector = inbound[0];
        if (inboundConnector === undefined) {
          throw new Error(`Component ${name} has no inbound connector`);
        }
        if (previousOutboundConnector !== inboundConnector) {
          throw new Error(
            `Component ${previousComponent.name}--${previousOutboundConnector}--> is incompatible with --${inboundConnector}-->${name}`,
          );
        }
      }

      const component = {
        name,
        inbound,
        outbound,
        fill,
      };

      previousComponent = component;

      return component;
    });
  }

  /**
   * @param graph
   * @returns the hexagon node if the graph is hexagonal, otherwise null
   */
  private hexagon(graph: ComponentGraph<Assembly>): string | null {
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
  private toAssemblyGraph(assembly: Assembly): ComponentGraph<Assembly> {
    return this.graph.reduceDirectedEdges<ComponentGraph<Assembly>>(
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
