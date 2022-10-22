import NotionAPI from "../notion/NotionAPI";
import Graph from "./Graph";
import Page from "../notion/blocks/Page";
import Cache from "./Cache";
import fs from "fs";
import VirtualPage from "../notion/blocks/VirtualPage";

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

  private async fillGraph(pageIdOrVirtualPage: string|VirtualPage, parentPage?: Page) {
    // Obtenir les link_to_page et les child_page

    const pageId = typeof pageIdOrVirtualPage === "string" ? pageIdOrVirtualPage : pageIdOrVirtualPage.id;

    const cachedPage = this.cache?.cached_pages[pageId];

    let page: Page;
    if(pageIdOrVirtualPage instanceof VirtualPage) {
      page = pageIdOrVirtualPage;
    } else if(cachedPage?.virtual) {
      page = new VirtualPage([{plain_text: cachedPage.title}] as any, pageId);
    } else {
      page = await this.notion.retrievePage(pageIdOrVirtualPage);
    }

    parentPage && parentPage.childPages.push(page);

    let childPages: (string|VirtualPage)[];

    if(cachedPage && page.last_edited_time === cachedPage.last_edited_time) {
      console.log("Get page from cache: "+page.title);

      page.cached = true;
      page.virtual = cachedPage.virtual;
      page.path = () => cachedPage.path;
      page.folder = () => cachedPage.folder;
      childPages = cachedPage.child_pages;
    } else {
      console.log("Processing page: "+page.title);
      if(!(page instanceof VirtualPage)) {
        await this.notion.retrievePageBlocks(page);
      }
      childPages = page.getChildPages();
    }

    page.parent = parentPage;

    this.nodes.set(page.id, page);

    const promises: Promise<void>[] = [];

    for(const child of childPages) {
      promises.push(this.fillGraph(child, page));
    }

    await Promise.all(promises);
  }
}