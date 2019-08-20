import { MyVue } from "types";
import Vue from "vue";
import { lsGet, lsSet } from "service/local-storage-service";

function browserLanguage() {
  let lang = lsGet("lang");
  try {
    return (
      lang ||
      navigator["browserLanguage"] ||
      navigator["language"] ||
      navigator["userLanguage"]
    ).substr(0, 2);
  } catch (e) {
    return "en";
  }
}

export function setTitle(lang: Lang) {
  if (lang == "ja") {
    document.title = `次世代デジタルライブラリー`;
  } else {
    document.title = `Next Digital Library`;
  }
}

export type Lang = "ja" | "en";

export class AppState {
  lang: Lang = browserLanguage();

  switchLang() {
    if (this.lang === "ja") this.lang = "en";
    else this.lang = "ja";
    lsSet("lang", this.lang);

    setTitle(this.lang);
  }
}

export const state: AppState = new AppState();

//stateのreactive化
new Vue({
  data: {
    state: state
  }
});
