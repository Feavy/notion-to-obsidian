import Node from "./Node";

export default class Graph {
  public readonly nodes: Node[] = [];

  public addNode(node: Node) {
    this.nodes.push(node);
  }
}