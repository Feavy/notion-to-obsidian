import Block from "./Block";
import {NotionBlock, NotionRichText} from "../NotionTypes";
import {plaintexts, texts} from "../NotionUtils";

export type NotionHeading1 = Extract<NotionBlock, { type: 'heading_1' }>;
export type NotionHeading2 = Extract<NotionBlock, { type: 'heading_2' }>;
export type NotionHeading3 = Extract<NotionBlock, { type: 'heading_3' }>;

export type NotionHeading = NotionHeading1 | NotionHeading2 | NotionHeading3;

export default abstract class Heading extends Block {
  public readonly text: string;
  public readonly plainText: string;
  public readonly richText: NotionRichText[];
  private readonly prefix: string;

  protected constructor(private readonly block: NotionHeading, children: Block[]) {
    super(block, children);
    if(block.type === 'heading_1') {
      this.text = texts(block.heading_1.rich_text);
      this.plainText = plaintexts(block.heading_1.rich_text);
      this.richText = block.heading_1.rich_text;
      this.prefix = '#';
    } else if(block.type === 'heading_2') {
      this.text = texts(block.heading_2.rich_text);
      this.plainText = plaintexts(block.heading_2.rich_text);
      this.richText = block.heading_2.rich_text;
      this.prefix = '##';
    } else if(block.type === 'heading_3') {
      this.text = texts(block.heading_3.rich_text);
      this.plainText = plaintexts(block.heading_3.rich_text);
      this.richText = block.heading_3.rich_text;
      this.prefix = '###';
    }
  }

  public toMarkdown(): string {
    return `# ${this.text}\n`;
  }
}