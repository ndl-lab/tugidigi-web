import Vue from "vue";
import Component from "vue-class-component";
import { removeFromArray } from "./objects";

export function isValidUrl(url: string): boolean {
  return url.match(/^https*:.+/) != null;
}

export function getQueryMap(url?: string): { [key: string]: string[] } {
  var vars: { [key: string]: string[] } = {};
  if (!url) url = window.location.search;
  let query: string[] = url.slice(1).split("&");
  for (var i = 0; i < query.length; i++) {
    let array: string[] = query[i].split("=");
    if (array[0]) {
      if (!vars[array[0]]) vars[array[0]] = [];
      vars[decodeURIComponent(array[0])].push(decodeURIComponent(array[1]));
    }
  }
  return vars;
}

export function toQueryString(map: { [key: string]: string[] }): string {
  let q = "";
  Object.keys(map).forEach(key => {
    let val = map[key];
    if (Array.isArray(val)) {
      (<any[]>val).forEach(a => {
        if (q.length > 0) q += "&";
        q += encodeURIComponent(key) + "=" + encodeURIComponent(a);
      });
    } else {
      if (q.length > 0) q += "&";
      q += encodeURIComponent(key) + "=" + encodeURIComponent(val);
    }
  });
  return "?" + q;
}

export function getPath(): string {
  return window.location.pathname;
}

//popstateで動かすための仕組み
const popStateFunctions: ((ev: PopStateEvent) => void)[] = [];
window.onpopstate = (ev: PopStateEvent) => {
  popStateFunctions.forEach(f => f(ev));
};

export function addPopStateListener(f: (ev: PopStateEvent) => void) {
  popStateFunctions.push(f);
}

export function pushState() {}
