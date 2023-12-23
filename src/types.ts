import Graph from 'graphology';

export type Connector = 'rectangle' | 'triangle' | 'semicircle' | 'stairs';

export type ComponentAttributes = {
  fill: string;
  input: Connector;
};

export type ConnectionAttributes = {
  assembly: string;
};

export class AssemblyGraph extends Graph<ComponentAttributes, ConnectionAttributes> {}
