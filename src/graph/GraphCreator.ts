import NotionAPI from "../notion/NotionAPI";
import ChildPage from "../notion/blocks/ChildPage";
import Graph from "./Graph";
import Page from "../notion/blocks/Page";
import Cache from "./Cache";
import fs from "fs";

export default class GraphCreator {
  public constructor(private readonly notion: NotionAPI) { }

  private readonly nodes: Map<string, Page> = new Map();

  private cache: Cache;

  public async createGraph(pageId: string) {
    this.loadCache();

    // Créer le graph
    await this.fillGraph(pageId);

    return new Graph(this.nodes, this.cache);
  }

  private loadCache() {
    try {
      this.cache = JSON.parse(fs.readFileSync("vault/cache.json", "utf8")) as Cache;
    } catch (e) {
      console.log("No cache found");
    }
  }

  private async fillGraph(pageId: string, parentPage?: Page) {
    // Obtenir les link_to_page et les child_page
    const page = await this.notion.retrievePage(pageId);
    parentPage && parentPage.childPages.push(page);
    const cachedPage = this.cache?.cached_pages[page.id];

    if(cachedPage && page.last_edited_time === cachedPage.last_edited_time) {
      console.log("Get page from cache: "+page.title);

      page.cached = true;
      page.path = () => this.cache.cached_pages[page.id].path;
      page.folder = () => this.cache.cached_pages[page.id].folder;

      this.nodes.set(page.id, page);

      const promises: Promise<void>[] = [];

      for(const child of cachedPage.child_pages) {
        promises.push(this.fillGraph(child, page));
      }

      await Promise.all(promises);
      return;
    }

    await this.notion.retrievePageBlocks(page);

    console.log("Processing page: "+page.title);
    page.parent = parentPage;

    const children: ChildPage[] = page.getAll("child_page");

    this.nodes.set(page.id, page);

    const promises: Promise<void>[] = [];

    for(const child of children) {
      promises.push(this.fillGraph(child.id, page));
    }

    await Promise.all(promises);
  }
}