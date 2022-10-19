import Block from "./Block";
import {NotionBlock} from "../NotionTypes";
import {texts} from "../NotionUtils";
import Graph from "../../graph/Graph";

export default class DefaultBlock extends Block {
  constructor(private readonly block: NotionBlock, children: Block[]) {
    super(block, children);
  }

  public toMarkdown(graph: Graph): string {
    if(this.block[this.block.type].rich_text) {
      return texts(this.block[this.block.type].rich_text)+"\n";
    }
    return this.children.map(child => child.toMarkdown(graph)).join("\n");
  }
}