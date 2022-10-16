import Block from "./Block";
import {NotionBlock} from "../NotionTypes";
import ChildPage from "./ChildPage";
import DefaultBlock from "./DefaultBlock";
import LinkToPage from "./LinkToPage";

type BlockConstructor<T extends Block, B extends NotionBlock> = new (block: B, children: Block[]) => T;

export default class Blocks {
  private static readonly blocks = new Map<string, BlockConstructor<any, any>>();

  static {
    Blocks.register("child_page", ChildPage);
    Blocks.register("link_to_page", LinkToPage);
  }

  private static register(type: string, block: BlockConstructor<any, any>) {
    Blocks.blocks.set(type, block);
  }

  public static create(block: NotionBlock, children: Block[]): Block {
    const ctor = Blocks.blocks.get(block.type);
    if(!ctor) {
      return new DefaultBlock(block, children);
    }
    return new ctor(block, children);
  }

}