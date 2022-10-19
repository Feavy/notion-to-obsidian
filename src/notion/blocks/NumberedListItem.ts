import Block from "./Block";
import {NotionBlock} from "../NotionTypes";
import {texts} from "../NotionUtils";

export type NotionParagraph = Extract<NotionBlock, { type: 'numbered_list_item' }>;

export default class NumberedListItem extends Block {
  constructor(private readonly block: NotionParagraph, children: Block[]) {
    super(block, children);
  }

  public toMarkdown(): string {
    return `1. ${texts(this.block.numbered_list_item.rich_text)}\n`;
  }
}