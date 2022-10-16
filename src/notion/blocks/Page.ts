import Block from "./Block";
import {plaintexts} from "../NotionUtils";

export default class Page extends Block {
  public readonly last_edited_time: string;
  public readonly title: string;
  public readonly url: string;

  public constructor(page: any) {
    super(page,  [])

    this.url = page.url;
    this.title = plaintexts(page.properties.title.title);
    this.last_edited_time = page.last_edited_time;
  }

  public set blocks(blocks: Block[]) {
    this.children.push(...blocks);
  }

  public get blocks() {
    return this.children;
  }
};