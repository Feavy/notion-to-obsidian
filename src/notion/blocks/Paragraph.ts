import Block from "./Block";
import {NotionBlock} from "../NotionTypes";
import {texts} from "../NotionUtils";

export type NotionParagraph = Extract<NotionBlock, { type: 'paragraph' }>;

export default class Paragraph extends Block {
  constructor(private readonly block: NotionParagraph, children: Block[]) {
    super(block, children);
  }

  public toMarkdown(): string {
    return `${texts(this.block.paragraph.rich_text)}\n`;
  }
}