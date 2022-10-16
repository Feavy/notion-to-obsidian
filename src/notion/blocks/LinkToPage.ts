import Block from "./Block";
import {NotionBlock} from "../NotionTypes";
import {texts} from "../NotionUtils";

export type NotionLinkToPage = Extract<NotionBlock, { type: 'link_to_page' }>;

export default class LinkToPage extends Block {
  public readonly page_id;
  constructor(private readonly block: NotionLinkToPage, children: Block[]) {
    super(block, children);
    if("page_id" in block.link_to_page) {
      this.page_id = block.link_to_page.page_id;
    }
  }
}