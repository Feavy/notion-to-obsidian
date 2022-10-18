import Page from "../notion/blocks/Page";

export default class Graph {
  public constructor(public readonly nodes: Set<Page>) { }

  public generateMarkdownFiles() {
    for(const page of this.nodes) {
      page.writeToFile();
    }
  }
}