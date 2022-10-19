import Block from "./Block";
import {NotionBlock} from "../NotionTypes";
import {texts} from "../NotionUtils";

export type NotionHeading1 = Extract<NotionBlock, { type: 'heading_3' }>;

export default class Heading3 extends Block {
  constructor(private readonly block: NotionHeading1, children: Block[]) {
    super(block, children);
  }

  public toMarkdown(): string {
    return `### ${texts(this.block.heading_3.rich_text)}\n`;
  }
}