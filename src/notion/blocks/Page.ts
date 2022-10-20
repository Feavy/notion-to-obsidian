import Block from "./Block";
import {escape, plaintexts} from "../NotionUtils";
import {NotionPage, NotionRichText} from "../NotionTypes";
import fs from "fs";
import Graph from "../../graph/Graph";

export default class Page extends Block {
  public readonly last_edited_time: string;
  public readonly title: string;
  public readonly url: string;
  public slug: string;
  public parent?: Page;
  public cached: boolean = false;

  public readonly childPages: Page[] = [];

  public constructor(page: NotionPage) {
    super(page as any, [])

    this.url = page.url;
    this.title = plaintexts((page.properties.title as any).title);
    this.last_edited_time = page.last_edited_time;
    this.slug = page.url.substring(22, page.url.length - 33);
  }

  public path() {
    if (this.parent) {
      return this.parent.path() + "/" + escape(this.title);
    }
    return escape(this.title);
  }

  public folder() {
    if (this.parent) {
      return this.parent.path();
    }
    return null;
  }

  public getLinks(): NotionRichText[] {
    const links = [];
    this.visitDeep(block => {
      if(block.internal[block.type]?.rich_text) {
        for(const richText of block.internal[block.type].rich_text) {
          if (richText.href) {
            links.push(richText);
          }
        }
      }
    });
    return links;
  }

  public toMarkdown(graph: Graph): string {
    let content = this.url + "\n\n";
    for(const child of this.children) {
      content += child.toMarkdown(graph)+"\n";
    }
    return content;
  }

  public writeToFile(graph: Graph) {
    let filename = this.path() + ".md";
    let content = this.toMarkdown(graph);
    console.log("Writing to file: " + filename);
    if (this.parent) {
      fs.mkdirSync("vault/" + this.parent.path(), {recursive: true});
    }
    fs.writeFileSync("vault/" + filename, content);
  }
};