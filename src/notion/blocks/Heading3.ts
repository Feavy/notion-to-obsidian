import Block from "./Block";
import Heading, {NotionHeading3} from "./Heading";

export default class Heading3 extends Heading {
  constructor(block: NotionHeading3, children: Block[]) {
    super(block, children);
  }
}