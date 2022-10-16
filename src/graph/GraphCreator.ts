import NotionAPI from "../notion/NotionAPI";
import LinkToPage from "../notion/blocks/LinkToPage";
import ChildPage from "../notion/blocks/ChildPage";
import Node from "./Node";
import Graph from "./Graph";

export default class GraphCreator {
  public constructor(private readonly notion: NotionAPI) { }

  private readonly nodes: Map<string, Node> = new Map();

  public async createGraph(pageId: string) {
    // Créer le graph
    await this.fillGraph(pageId);

    // Lier le graph
    this.linkGraph();

    return new Graph(new Set(this.nodes.values()));
  }

  private async fillGraph(pageId: string) {
    // Obtenir les link_to_page et les child_page
    const page = await this.notion.retrievePage(pageId);
    console.log("Processing page: "+page.title);
    await this.notion.retrievePageBlocks(page);

    const links: LinkToPage[] = page.getAll("link_to_page");
    const children: ChildPage[] = page.getAll("child_page");

    const node = new Node(page);
    for(const link of links) {
      node.references.push(link.page_id);
    }
    for(const child of children) {
      node.references.push(child.id);
    }

    this.nodes.set(page.id, node);

    const promises: Promise<void>[] = [];

    for(const child of children) {
      promises.push(this.fillGraph(child.id));
    }

    await Promise.all(promises);
  }

  private linkGraph() {
    for(const node of this.nodes.values()) {
      for(const reference of node.references) {
        if(typeof reference === "string") {
          const ref = this.nodes.get(reference);
          if(ref) {
            node.replaceReference(ref);
          }
        }
      }
    }
  }
}