import Block from "./Block";
import Heading, {NotionHeading1} from "./Heading";

export default class Heading1 extends Heading {
  constructor(block: NotionHeading1, children: Block[]) {
    super(block, children);
  }
}