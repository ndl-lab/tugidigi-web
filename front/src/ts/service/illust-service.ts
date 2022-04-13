import * as Axios from "axios";
import * as Config from "config";
import { Book } from "domain/book";
import { SearchResult, SearchQuery, toSearchQueryString } from "./search-utils";
import { cacheGet } from "./cache-util";
import { Illustration } from "domain/illustration";

const BASE_URL = Config.BASE_PATH + "api/illustration/";
const CACHE_NAME = "illustration";

export function searchIllustration(
  q: SearchQuery
): Axios.AxiosPromise<SearchResult<Illustration>> {
  return Axios.default.get<SearchResult<Illustration>>(
    BASE_URL + "search" + toSearchQueryString(q)
  );
}
export function searchEachIllustration(
  q: SearchQuery
): Axios.AxiosPromise<SearchResult<Illustration>> {
  return Axios.default.get<SearchResult<Illustration>>(
    BASE_URL + "searcheachimage" + toSearchQueryString(q)
  );
}

export function putImageFeature(feature: number[]): Axios.AxiosPromise<SearchResult<Illustration>> {
      return Axios.default.post<SearchResult<Illustration>>(BASE_URL + "searchbyfeature", feature);
}

export function getIllustration(id: string): Axios.AxiosPromise<Illustration> {
  return Axios.default.get<Illustration>(BASE_URL + "/" + id);
}

export function getIllustrations(
  ids: string[]
): Axios.AxiosPromise<Illustration[]> {
  return Axios.default.get<Illustration[]>(
    BASE_URL + "multi-get?ids=" + ids.join(",")
  );
}

export function getIllustrationsByBook(
  id: string
): Axios.AxiosPromise<SearchResult<Illustration>> {
  return Axios.default.get<SearchResult<Illustration>>(BASE_URL + "of/" + id);
}

export function getDefaultIllustrations(): Axios.AxiosPromise<Illustration[]> {
  return Axios.default.get<Illustration[]>(BASE_URL + "default");
}

export function getRandomIllustrations(): Axios.AxiosPromise<Illustration[]> {
  return Axios.default.get<Illustration[]>(BASE_URL + "random?size=10");
}

export function getRandomIllustrationsWithFacet(facettype:string): Axios.AxiosPromise<Illustration[]> {
  if(facettype=="imgonly"){
    return Axios.default.get<Illustration[]>(BASE_URL + "randomwithfacet?size=10");
  }else if(facettype=="graphic"){
    return Axios.default.get<Illustration[]>(BASE_URL + "randomwithfacet?size=10&f-graphictags.tagname=graphic&f-graphictags.tagname=-picture");
  }else if(facettype=="picture"){
    return Axios.default.get<Illustration[]>(BASE_URL + "randomwithfacet?size=10&f-graphictags.tagname=picture&f-graphictags.tagname=-graphic");
  }else if(facettype=="map"){
    return Axios.default.get<Illustration[]>(BASE_URL + "randomwithfacet?size=10&f-graphictags.tagname=graphic_map");
  }else{
    getRandomIllustrations();
  }
}
