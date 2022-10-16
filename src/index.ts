import * as dotenv from "dotenv"
dotenv.config()

import GraphCreator from "./graph/GraphCreator";
import NotionAPI from "./notion/NotionAPI";

const notionSecret = process.env.NOTION_SECRET;
const notionPage = process.env.NOTION_PAGE;

const creator = new GraphCreator(new NotionAPI(notionSecret));
(async () => {
  const graph = await creator.createGraph(notionPage);
  graph.generateMarkdownFiles();
})();
