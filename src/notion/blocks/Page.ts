import Block from "./Block";
import {escape, plaintexts} from "../NotionUtils";
import {NotionPage} from "../NotionTypes";
import fs from "fs";

export default class Page extends Block {
  public readonly last_edited_time: string;
  public readonly title: string;
  public readonly url: string;
  public slug: string;
  public parent?: Page;

  public readonly references: (Page | string)[] = []

  public constructor(page: NotionPage) {
    super(page as any, [])

    this.url = page.url;
    this.title = plaintexts((page.properties.title as any).title);
    this.last_edited_time = page.last_edited_time;
    this.slug = page.url.substring(22, page.url.length - 33);
  }

  public replaceReference(newNode: Page) {
    const index = this.references.indexOf(newNode.id);
    if (index > -1) {
      this.references[index] = newNode;
    }
  }

  public path() {
    if (this.parent) {
      return this.parent.path() + "/" + escape(this.title);
    }
    return escape(this.title);
  }

  public writeToFile() {
    let filename = this.path() + ".md";
    let content = this.url + "\n\n";
    for (const reference of this.references) {
      if (reference instanceof Page) {
        content += `[[${reference.path()}.md]]\n`;
      }
    }
    console.log("Writing to file: " + filename);
    if (this.parent) {
      fs.mkdirSync("vault/" + this.parent.path(), {recursive: true});
    }
    fs.writeFileSync("vault/" + filename, content);
  }
};