import Block from "./Block";
import Heading, {NotionHeading2} from "./Heading";

export default class Heading2 extends Heading {
  constructor(block: NotionHeading2, children: Block[]) {
    super(block, children);
  }
}