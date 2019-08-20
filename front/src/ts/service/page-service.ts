import * as Axios from "axios";
import * as Config from "config";
import { Page } from "domain/page";
import { cacheGet } from "./cache-util";
import { SearchQuery, SearchResult, toSearchQueryString } from "./search-utils";

const BASE_URL = Config.BASE_PATH + "api/page/";
const CACHE_NAME = "page";

export function getPage(id: string): Promise<Page> {
  return cacheGet(CACHE_NAME, id, BASE_URL + id);
}

export function searchPage(
  q: SearchQuery
): Axios.AxiosPromise<SearchResult<Page>> {
  return Axios.default.get<SearchResult<Page>>(
    BASE_URL + "search" + toSearchQueryString(q)
  );
}
