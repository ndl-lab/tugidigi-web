import * as Axios from "axios";

let cache = {};

export function putCache(type: string, id: string, value: any) {
  if (cache[type] == null) cache[type] = {};
  cache[type][id] = value;
}

/**
 *
 * 指定されたtype、idのGETが過去に行われている場合、キャッシュ（メモリ）から応答する。
 * 行われていなかった場合、指定されたURLでGETを行い、値をキャッシュに格納する。
 *
 * @param type キャッシュの種類
 * @param id ID
 * @param getUrl HTTP GETを発行するURL
 *
 */
export function cacheGet<T>(
  type: string,
  id: string,
  getUrl: string
): Promise<T> {
  if (cache[type] == null) cache[type] = {};
  return new Promise<T>((resolve, reject) => {
    //キャッシュにヒットした場合
    if (cache[type][id]) {
      if (cache[type][id] instanceof Promise) {
        let promise = <Axios.AxiosPromise<T>>cache[type][id];
        promise
          .then(result => {
            resolve(result.data);
            return result;
          })
          .catch(result => {
            reject(result);
            return Promise.reject(result);
          });
      } else {
        resolve(cache[type][id]);
      }
    } else {
      let promise = Axios.default
        .get(getUrl)
        .then(result => {
          cache[type][id] = result.data;
          resolve(result.data);
          return result;
        })
        .catch(result => {
          cache[type][id] = null;
          reject(result);
          return Promise.reject(result);
        });
      if (cache[type][id] == null) {
        cache[type][id] = promise;
      }
    }
  });
}

/**
 *
 * 指定されたtype、idのキャッシュを削除する（データの更新があった時など）。
 *
 * @param type キャッシュの種類
 * @param id ID
 *
 */
export function clearCache(type: string, id: string) {
  if (cache[type]) cache[type][id] = null;
}
