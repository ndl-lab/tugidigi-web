import * as Axios from "axios";
import * as Config from "config";
import { Book } from "domain/book";
import { SearchResult, SearchQuery, toSearchQueryString } from "./search-utils";
import { cacheGet } from "./cache-util";

const BASE_URL = Config.BASE_PATH + "api/book/";
const CACHE_NAME = "book";

export function getBook(id: string): Promise<Book> {
  return cacheGet(CACHE_NAME, id, BASE_URL + "/" + id);
}

export function searchBook(
  q: SearchQuery
): Axios.AxiosPromise<SearchResult<Book>> {
  return Axios.default.get<SearchResult<Book>>(
    BASE_URL + "search" + toSearchQueryString(q)
  );
}

export function searchmetaBook(
  q: SearchQuery
): Axios.AxiosPromise<SearchResult<Book>> {
  return Axios.default.get<SearchResult<Book>>(
    BASE_URL + "searchmeta" + toSearchQueryString(q)
  );
}
