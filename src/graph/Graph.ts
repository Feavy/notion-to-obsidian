import Page from "../notion/blocks/Page";
import {NotionRichText} from "../notion/NotionTypes";
import {uuid} from "../notion/NotionUtils";
import Cache from "./Cache";
import fs from "fs";

export default class Graph {
  public constructor(public readonly nodes: Map<string, Page>, private readonly cache: Cache = {cached_pages: {}}) {
  }

  public getPage(id: string) {
    if(!id.includes("-")) {
      id = uuid(id);
    }
    return this.nodes.get(id);
  }

  public save() {
    for (const page of this.nodes.values()) {
      if(page.cached) continue;
      const links = page.getLinks();
      this.processLinks(links);
      page.writeToFile(this);
    }
    this.deleteRemovedPages();
    this.saveCache();
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

  private saveCache() {
    const cache: Cache = {cached_pages: {}};
    for (const page of this.nodes.values()) {
      cache.cached_pages[page.id] = {
        title: page.title,
        last_edited_time: page.last_edited_time,
        path: page.path(),
        folder: page.folder(),
        child_pages: page.childPages.map(page => page.id)
      };
    }
    fs.writeFileSync("vault/cache.json", JSON.stringify(cache, null, 2));
  }

  private deleteRemovedPages() {
    for (const [pageId, cachedPage] of Object.entries(this.cache.cached_pages)) {
      if (!this.nodes.has(pageId)) {
        console.log("Cached page no longer exists: " + cachedPage.path);
        fs.unlinkSync("vault/" + cachedPage.path + ".md");

        const folder = "vault/" + cachedPage.folder;
        if (fs.readdirSync(folder).length === 0) {
          fs.rmdirSync(folder);
        }
      }
    }
  }
}