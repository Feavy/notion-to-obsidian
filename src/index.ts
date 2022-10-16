import * as dotenv from "dotenv"
dotenv.config()

import GraphCreator from "./graph/GraphCreator";
import NotionAPI from "./notion/NotionAPI";

const notionSecret = process.env.NOTION_SECRET;
const notionPage = process.env.NOTION_PAGE;

const graphCreator = new GraphCreator(new NotionAPI(notionSecret));
graphCreator.createGraph(notionPage);
