import Page from "../notion/blocks/Page";
import {NotionRichText} from "../notion/NotionTypes";
import {uuid} from "../notion/NotionUtils";

export default class Graph {
  public constructor(public readonly nodes: Map<string, Page>) {
  }

  public getPage(id: string) {
    if(!id.includes("-")) {
      id = uuid(id);
    }
    return this.nodes.get(id);
  }

  public save() {
    for (const page of this.nodes.values()) {
      const links = page.getLinks();
      this.processLinks(links);
      page.writeToFile(this);
    }
  }

  private processLinks(links: NotionRichText[]) {
    for (const link of links) {
      const href = link.href;
      if (href.startsWith("https://www.notion.so/")) {
        //TODO : remplacer espaces par %20
        const id = href.substring(href.length - 32, href.length);
        if (id) {
          const page = this.getPage(id);
          if (page) {
            link.href = page.path().replaceAll(/ /g, "%20") + ".md";
          }
        }
      }
    }
  }
}