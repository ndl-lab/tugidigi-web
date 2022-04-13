import * as Axios from "axios";
import * as Config from "config";
import { Page } from "domain/page";
import { cacheGet } from "./cache-util";
import { SearchQuery, SearchResult, toSearchQueryString } from "./search-utils";

const BASE_URL = Config.BASE_PATH + "api/page/";
const ANALYZE_URL = Config.BASE_PATH + "api/analyze/page/";
const ANALYZE_KEYWORD_URL = Config.BASE_PATH + "api/analyze/normkeyword/";
const CACHE_NAME = "page";
const CACHE_ANALYZE_NAME = "analyze";

export function getPage(id: string): Promise<Page> {
  return cacheGet(CACHE_NAME, id, BASE_URL + id);
}
export function getAnalyzedPage(id: string): Promise<Page> {
  return cacheGet(CACHE_ANALYZE_NAME, id, ANALYZE_URL + id);
}
export function getAnalyzedKeyword(keyword: string): Promise<Page> {
  return cacheGet(CACHE_ANALYZE_NAME, btoa(unescape(encodeURIComponent(keyword))), ANALYZE_KEYWORD_URL + keyword);
}
export function searchPage(
  q: SearchQuery
): Axios.AxiosPromise<SearchResult<Page>> {
  return Axios.default.get<SearchResult<Page>>(
    BASE_URL + "search" + toSearchQueryString(q)
  );
}
