import Block from "./Block";
import {NotionBlock} from "../NotionTypes";
import {texts} from "../NotionUtils";

export type NotionHeading1 = Extract<NotionBlock, { type: 'heading_2' }>;

export default class Heading2 extends Block {
  constructor(private readonly block: NotionHeading1, children: Block[]) {
    super(block, children);
  }

  public toMarkdown(): string {
    return `## ${texts(this.block.heading_2.rich_text)}\n`;
  }
}