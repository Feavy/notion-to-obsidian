import Block from "./Block";
import {NotionBlock} from "../NotionTypes";
import Graph from "../../graph/Graph";

export type NotionParagraph = Extract<NotionBlock, { type: 'child_page' }>;

export default class ChildPage extends Block {
  public readonly title;
  constructor(private readonly block: NotionParagraph, children: Block[]) {
    super(block, children);
    this.title = block.child_page.title;
  }

  public toMarkdown(graph: Graph): string {
    const page = graph.getPage(this.id);
    return `[[${page.path()}]]\n`;
  }
}