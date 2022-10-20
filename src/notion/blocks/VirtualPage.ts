import Page from "./Page";
import {NotionRichText} from "../NotionTypes";
import Graph from "../../graph/Graph";
import ChildPage from "./ChildPage";

function randomUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default class VirtualPage extends Page {
  public readonly childPagesId: string[] = [];
  public readonly childPagesBlocks: ChildPage[] = [];

  constructor(title: NotionRichText[], id: string = randomUUID()) {
    super({
      type: "page",
      id: id,
      url: "https://notion.so/virtual-page-00000000000000000000000000000000",
      properties: {
        title: {
          title: title
        }
      }
    } as any);
  }

  public toMarkdown(graph: Graph): string {
    let content = "Virtual page\n\n";
    for(const childPageId of this.childPagesId) {
      const page = graph.getPage(childPageId);
      content += `[[${page.path()}]]\n`;
    }
    return content;
  }

  public addChildPage(block: ChildPage) {
    const pageId = block.id;
    block.id = this.id;
    this.childPagesId.push(pageId);
    this.childPagesBlocks.push(block);
  }

  public getChildPages(): (string | VirtualPage)[] {
    return this.childPagesId;
  }
}