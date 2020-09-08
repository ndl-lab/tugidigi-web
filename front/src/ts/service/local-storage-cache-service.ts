import { lsGet, lsSet, lsDelete } from "./local-storage-service";

export interface LsCacheConfig {
  type: string;
  maxCacheSize: number;
}

interface CacheObject {
  date: number;
  value: any;
}

interface LsCache {
  [index: string]: CacheObject;
}

function getCacheName(type: string) {
  return "jps-lscache-" + type;
}

export function putLsCache(conf: LsCacheConfig, id: string, value: any) {
  let cache: LsCache = lsGet(getCacheName(conf.type));
  if (!cache) {
    cache = {};
  }
  cache[id] = {
    date: new Date().getTime(),
    value: value
  };
  let keys = Object.keys(cache);
  if (keys.length > conf.maxCacheSize) {
    let oldestKey = keys
      .map(key => {
        return { key: key, date: cache[key].date };
      })
      .sort((a, b) => a.date - b.date)[0].key;
    delete cache[oldestKey];
  }
  lsSet(getCacheName(conf.type), cache);
}

export function getLsCache<T>(conf: LsCacheConfig, id: string): T {
  let cache: LsCache = lsGet(getCacheName(conf.type));
  if (!cache) return null;
  if (cache && cache[id]) {
    cache[id].date = new Date().getTime();
    lsSet(getCacheName(conf.type), cache);
    return cache[id].value;
  }
}

export function removeLsCache(conf: LsCacheConfig, id: string) {
  let cache: LsCache = lsGet(getCacheName(conf.type));
  if (cache && cache[id]) {
    delete cache[id];
    lsSet(getCacheName(conf.type), cache);
  }
}

export function clearLsCache(conf: LsCacheConfig) {
  lsDelete(getCacheName(conf.type));
}