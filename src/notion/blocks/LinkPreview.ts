import Block from "./Block";
import {NotionBlock} from "../NotionTypes";

export type NotionLinkPreview = Extract<NotionBlock, { type: 'link_preview' }>;

export default class LinkPreview extends Block {
  constructor(private readonly block: NotionLinkPreview, children: Block[]) {
    super(block, children);
  }

  public toMarkdown(): string {
    return `[${this.block.link_preview.url}](${this.block.link_preview.url})\n`;
  }

}