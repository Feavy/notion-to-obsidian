import Node from "./Node";
import * as fs from "fs";

export default class Graph {
  public constructor(public readonly nodes: Set<Node>) { }

  public generateMarkdownFiles() {
    for(const node of this.nodes) {
      Graph.generateMarkdownFile(node);
    }
  }

  private static generateMarkdownFile(node: Node) {
    let filename = Graph.escape(node.page.title)+".md";
    let content = "";
    for(const reference of node.references) {
      if(reference instanceof Node) {
        content += `[[${Graph.escape(reference.page.title)}]]\n`;
      }
    }
    fs.writeFileSync(`vault/${filename}`, content);
  }

  public static escape(title: string) {
    return title.replaceAll(/[*"/\\:|?<>]/g, "");
  }
}