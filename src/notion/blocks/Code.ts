import Block from "./Block";
import {NotionBlock} from "../NotionTypes";
import {texts} from "../NotionUtils";

export type NotionCode = Extract<NotionBlock, { type: 'code' }>;

export default class Code extends Block {
  constructor(private readonly block: NotionCode, children: Block[]) {
    super(block, children);
  }

  public toMarkdown(): string {
    return `\`\`\`\n${texts(this.block.code.rich_text)}\n\`\`\`\n`;
  }
}