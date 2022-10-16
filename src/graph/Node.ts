import Page from "../notion/blocks/Page";

export default class Node {
  public readonly id: string;

  public readonly references: (Node | string)[] = []

  public constructor(public readonly page: Page) {
    this.id = page.id;
  }

  public addReference(node: Node | string) {
    if(!this.references.includes(node)) {
      this.references.push(node);
    }
  }

  public replaceReference(newNode: Node) {
    const index = this.references.indexOf(newNode.id);
    if (index > -1) {
      this.references[index] = newNode;
    }
  }
}