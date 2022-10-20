export default interface Cache {
  cached_pages: {[key: string]: CachedPage};
}

export interface CachedPage {
  title: string;
  path: string;
  folder: string;
  last_edited_time: string;
  child_pages: string[];
}