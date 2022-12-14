import {NotionBlock} from "../NotionTypes";
import Graph from "../../graph/Graph";

export default abstract class Block {
  public internal: NotionBlock;
  public type: string;
  public id: string;

  protected constructor(block: NotionBlock, public readonly children: Block[]) {
    this.internal = block;
    this.id = block.id;
    this.type = block.type;
  }

  public visitDeep(visitor: (block: Block) => void) {
    visitor(this);
    this.children.forEach(child => child.visitDeep(visitor));
  }

  public getAll<T extends Block>(type: string): T[] {
    const result = [];
    this.visitDeep(block => {
      if (block.type === type) {
        result.push(block);
      }
    });
    return result;
  }

  public abstract toMarkdown(graph?: Graph): string;
}
