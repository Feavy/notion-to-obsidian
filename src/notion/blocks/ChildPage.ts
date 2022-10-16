import Block from "./Block";
import {NotionBlock} from "../NotionTypes";
import {texts} from "../NotionUtils";

export type NotionParagraph = Extract<NotionBlock, { type: 'child_page' }>;

export default class ChildPage extends Block {
  public readonly title;
  constructor(private readonly block: NotionParagraph, children: Block[]) {
    super(block, children);
    this.title = block.child_page.title;
  }
}