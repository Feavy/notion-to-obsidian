import Block from "./Block";
import {NotionBlock} from "../NotionTypes";
import {texts} from "../NotionUtils";

export type NotionParagraph = Extract<NotionBlock, { type: 'bulleted_list_item' }>;

export default class BulletedListItem extends Block {
  constructor(private readonly block: NotionParagraph, children: Block[]) {
    super(block, children);
  }

  public toMarkdown(): string {
    return `* ${texts(this.block.bulleted_list_item.rich_text)}\n`;
  }
}