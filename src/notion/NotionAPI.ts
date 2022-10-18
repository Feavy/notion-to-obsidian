import {Client} from "@notionhq/client";
import {NotionBlock, NotionPage} from "./NotionTypes";
import Block from "./blocks/Block";
import Blocks from "./blocks/Blocks";
import Page from "./blocks/Page";

export default class NotionAPI {
  private readonly notion: Client;

  public constructor(auth?: string) {
    this.notion = new Client({auth});
  }

  public async retrievePage(page_id: string): Promise<Page> {
    const pageData = await this.notion.pages.retrieve({page_id}) as NotionPage;

    return new Page(pageData);
  }

  public async retrievePageBlocks(page: Page) {
    page.children.push(...await this.retrieveBlocks(page.id));
  }

  public async retrieveBlocks(block_id: string): Promise<Block[]> {
    let response = await this.notion.blocks.children.list({block_id: block_id, page_size: 100});
    const blocks: NotionBlock[] = response.results.filter(block => "type" in block) as NotionBlock[];

    while(response.has_more) {
      response = await this.notion.blocks.children.list({block_id: block_id, page_size: 100, start_cursor: response.next_cursor});
      blocks.push(...response.results.filter(block => "type" in block) as NotionBlock[]);
    }

    return Promise.all(
        blocks.map(
            async (block): Promise<Block> => {
              return Blocks.create(block, block.has_children && block.type !== "child_page" ? await this.retrieveBlocks(block.id) : []);
            }
        )
    );
  }
}