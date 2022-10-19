import Block from "./Block";
import {NotionBlock} from "../NotionTypes";
import Graph from "../../graph/Graph";

export type NotionLinkToPage = Extract<NotionBlock, { type: 'link_to_page' }>;

export default class LinkToPage extends Block {
  public readonly page_id;

  constructor(private readonly block: NotionLinkToPage, children: Block[]) {
    super(block, children);
    if ("page_id" in block.link_to_page) {
      this.page_id = block.link_to_page.page_id;
    }
  }

  public toMarkdown(graph: Graph): string {
    if (this.page_id) {
      const page = graph.getPage(this.page_id);
      return `[[${page.path()}]]\n`;
    } else {
      return "Link to page of type " + this.block.link_to_page + " is not supported.\n";
    }
  }
}