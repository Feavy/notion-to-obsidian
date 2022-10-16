import NotionAPI from "../notion/NotionAPI";
import LinkToPage from "../notion/blocks/LinkToPage";
import ChildPage from "../notion/blocks/ChildPage";
import Node from "./Node";

export default class GraphCreator {
  public constructor(private readonly notion: NotionAPI) { }

  private readonly nodes: Map<string, Node> = new Map();

  public async createGraph(pageId: string) {
    // Créer le graph
    await this.fillGraph(pageId);
    this.linkGraph();

    for(const node of this.nodes.values()) {
      console.log(node.page.title, node.page.url, "->");
      for(const ref of node.references) {
        if(ref instanceof Node) {
          console.log("   ", ref.page.title);
        }else{
          console.error("Unexpected reference of type string : " + ref);
        }
      }
    }
  }

  private async fillGraph(pageId: string) {
    // Obtenir les link_to_page et les child_page
    const page = await this.notion.retrievePage(pageId);
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

    for(const child of children) {
      await this.fillGraph(child.id);
    }
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