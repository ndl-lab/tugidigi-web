import { AxiosPromise } from "axios";
import * as Config from "config";
import { LangString } from "domain/common";
import { AppState, state, setTitle } from "model/state";
import tippy, { Props } from "tippy.js";
import "tippy.js/dist/tippy.css";
import { deepFind, equals, clone, isEmpty } from "utils/objects";
import Vue, { VNodeDirective } from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Illustration } from "domain/illustration";
import { iiifUrlWithHeight } from "service/illust-utils";

export interface MyVue {
  $state: AppState;

  /**
   * 言語に合わせたメッセージを呼び出す
   * @param key
   */
  $l(key: string): string;
  /**
   * 言語に合わせたメッセージを呼び出し、テンプレートに変数を埋め込む
   * @param key
   */
  $lt(key: string, ...vars: any[]): string;

  /**
   *
   * LangStringを言語に合わせて表示する
   * @param ls
   * @param fallback
   */
  $ls(ls: LangString, fallback?: string): string;
  /**
   * Itemのラベルを言語に合わせて表示する
   * @param item
   */
  $err(key: string, name?: string): string;

  $enum(enumId: string): string[];
  $e(enumId: string, code: string);
  $clabel(field: string): string;
  $jump(url: string, tgtBlank?: boolean): void;

  $registerComponentLang(langComp: LangResource);
  $getRegisterdLang(key: string): LangString;
  $abb(str: string, len: number): string;

  $confirm(msg: string): Promise<any>;
  $notifySuccess(msg: string, once?: boolean);
  $notifyError(msg: string, once?: boolean);
  $notifyInfo(
    msg: string,
    actionText: string,
    onAction: () => void,
    once?: boolean
  );
  $clearNotify(): void;

  $isEmpty(v: any): boolean;
  $join(arr: string[] | string): string;

  $scrollToTop();
  $scrollToSearchResult();
  $disableScroll();
  $enableScroll();

  $setLoading(flag: boolean);
  $isLoading(): boolean;
  $loadingExecutor<T>(): LoadingExecutor<T>;

  $url(path: string): string;
  $fullUrl(path: string): string;
  $arrayremove(array: any[], value: any): void;
  $setProperties(tgt: object, to: object): void;

  $hasAdminFor(data): boolean;
  $hasEditFor(data): boolean;

  $num(n: number): string;
  $date(date: number): string;
  $dateTime(date: number): string;
}

//アプリケーションで共通の状態

class LoadingExecutor<T> {
  constructor(private g: JpsGlobalMixin) {}

  /**
   * Loadingを消したあと、成功の場合にはAPI結果のデータを返し、失敗だった場合にはエラーコードを返す
   * */
  execute(promise: AxiosPromise<T>): Promise<T> {
    return promise
      .then(r => {
        this.g.$setLoading(false);
        return r.data;
      })
      .catch(r => {
        this.g.$setLoading(false);
        return Promise.reject(r.response.data);
      });
  }

  /**
   * Loadingを消したあと、通知を行う。成功の場合にはAPI結果のデータを返し、失敗だった場合にはエラーコードを返す
   * */
  executeAndNotify(successMsg: string, promise: AxiosPromise<T>): Promise<T> {
    return promise
      .then(r => {
        this.g.$notifySuccess(successMsg);
        this.g.$setLoading(false);
        return r.data;
      })
      .catch(r => {
        let code = deepFind(r, "response.data.title");
        this.g.$notifyError(this.g.$l("e-" + code));
        this.g.$setLoading(false);
        return Promise.reject(code);
      });
  }
}

//言語とコード

export interface LangResource {
  [key: string]: LangString;
}

declare module "vue/types/vue" {
  interface Vue {
    $l2(s1: string, s2: string): string;
  }
} 

let nnnlist: any[] = [];
@Component({})
class JpsGlobalMixin extends Vue {
  @Prop() $langOverride: LangResource;

  $langResource: LangResource = null;

  get $state(): AppState {
    return state;
  }


  // /**言語リソース*/
  $l(key: string): string {
    if (!key) {
      if (process.env.NODE_ENV === "development") {
        console.warn("キーが指定されていないよ@", this.$options.name);
      }
      return "";
    }
    if (this.$langOverride && this.$langOverride[key] != null)
      return this.$langOverride[key][state.lang];
    if (this.$langResource && this.$langResource[key] != null)
      return this.$langResource[key][state.lang];
    if (globalLangResource[key] != null)
      return globalLangResource[key][state.lang];

    if (process.env.NODE_ENV === "development") {
      let json = {};
      json[key] = {
        ja: "[値はまだない]",
        en: "[値はまだない]"
      };
      let jsons = JSON.stringify(json);
      console.info(this.$options.name);
      console.info(jsons.substring(1, jsons.length - 1) + ",");
      return "[" + this.$options.name + "." + key + "." + state.lang + "]";
    }

    return "";
  }

  /**言語切替え用の値、{}を使ったテンプレート記法の場合*/
  $lt(key: string, ...vars: any[]): string {
    if (!key) return "";
    var template: string = this.$l(key);
    if (template) {
      for (var i = 0; i < vars.length; i++) {
        template = template.replace(/\{\}/, vars[i]);
      }
      return template;
    } else {
      //どちらも見つからない場合
      return "[" + state.lang + "." + key + "]";
    }
  }

  $ls(ls: LangString, fallback: string = ""): string {
    if (!ls) return fallback;
    if (ls[this.$state.lang]) return ls[this.$state.lang];
    if (ls.ja) return ls.ja;
    // if (process.env.NODE_ENV === "development") {
    //     return "[Empty LagnString]"
    // }
    return fallback;
  }

  $l2(s1: string, s2: string) {
    return this.$state.lang === "ja" ? s1 : s2;
  }

  $url(path: string) {
    return Config.BASE_PATH + path;
  }

  imgurl(i: Illustration) {
    return iiifUrlWithHeight(i, 128);
  }

  $fullUrl(path: string) {
    return Config.DOMAIN + Config.BASE_PATH + path;
  }

  $abb(str: string, len: number): string {
    if (!str) return "";
    if (str.length < len) return str;
    return str.substring(0, len) + "...";
  }

  $abbs(ls: LangString, len: number): string {
    return this.$abb(this.$ls(ls), len);
  }

  $join(arr: string[] | string): string {
    if (arr && Array.isArray(arr))
      return arr.join(this.$state.lang == "ja" ? "、" : ", ");
    else return <string>arr;
  }

  $isEmpty(v: any): boolean {
    return isEmpty(v);
  }

  $confirm(msg: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.$buefy.dialog.confirm({
        message: msg,
        confirmText: this.$l("l-yes"),
        cancelText: this.$l("l-no"),
        onConfirm: resolve,
        onCancel: reject
      });
    });
  }

  $notifySuccess(msg: string, once: boolean = false) {
    if (once && nnnlist.some(n => n.isActive && n.message === msg)) return;
    nnnlist.push(
      this.$buefy.snackbar.open({
        duration: 6000,
        message: msg,
        type: "is-success",
        position: "is-bottom",
        // indefinite: true,
        actionText: " ",
        queue: false
      })
    );
  }

  $notifyInfo(
    msg: string,
    actionText: string,
    onAction: () => void,
    once: boolean = false
  ) {
    if (once && nnnlist.some(n => n.isActive && n.message === msg)) return;
    nnnlist.push(
      this.$buefy.snackbar.open({
        message: msg,
        type: "is-info",
        position: "is-bottom",
        duration: 6000,
        actionText: actionText,
        onAction: onAction
      })
    );
  }

  $notifyError(msg: string, once: boolean = false) {
    if (once && nnnlist.some(n => n.isActive && n.message === msg)) return;
    nnnlist.push(
      this.$buefy.snackbar.open({
        message: msg,
        type: "is-danger",
        position: "is-bottom",
        indefinite: true,
        actionText: "close",
        queue: false
      })
    );
  }

  $clearNotify() {
    nnnlist.filter(n => n.isActive).forEach(n => n.close());
    nnnlist = [];
  }

  $setProperties(tgt: object, to: object) {
    let toKeys = Object.keys(to);
    Object.keys(tgt)
      .filter(key => !toKeys.includes(key))
      .forEach(delKey => {
        this.$delete(tgt, delKey);
      });
    toKeys.forEach(key => {
      this.$set(tgt, key, clone(to[key]));
    });
  }

  $loadingExecutor<T>(): LoadingExecutor<T> {
    this.$setLoading(true);
    return new LoadingExecutor<T>(this);
  }

  $registerComponentLang(langResource: LangResource) {
    this.$langResource = Object.assign(this.$langResource || {}, langResource);
  }

  $arrayremove(array: any[], value: any) {
    let index = array.indexOf(value);
    if (index >= 0) this.$delete(array, index);
  }

  $setLoading(flag: boolean) {
    setLoading(flag);
  }

  $isLoading(): boolean {
    return isLoading();
  }

  $scrollToTop() {
    window.scrollTo(0, 0);
  }

  $disableScroll() {
    document.documentElement.classList.add("jps-is-clipped");
  }

  $enableScroll() {
    document.documentElement.classList.remove("jps-is-clipped");
  }

  $date(date: number): string {
    if (!date) return "";
    let dateObject = new Date(date);
    return (
      dateObject.getFullYear() +
      "/" +
      this.zeroPadding(dateObject.getMonth() + 1, 2) +
      "/" +
      this.zeroPadding(dateObject.getDate(), 2)
    );
  }

  $jump(url: string, tgtBlank: boolean = false) {
    if (tgtBlank) {
      window.open(url, "_blank");
    } else window.location.href = url;
  }

  $errorsrc(url: string, ev) {
    ev.srcElement.src = url;
  }

  $num(n: number): string {
    if (n != null) return n.toLocaleString();
    return "";
  }

  $setTitle(title: string) {
    if (title) document.title = title + " - " + Config.SERVICE_NAME;
    else document.title = Config.SERVICE_NAME;
  }

  $dateTime(date: number): string {
    if (!date) return "";
    let dateObject = new Date(date);
    return (
      dateObject.getFullYear() +
      "/" +
      this.zeroPadding(dateObject.getMonth() + 1, 2) +
      "/" +
      this.zeroPadding(dateObject.getDate(), 2) +
      " " +
      this.zeroPadding(dateObject.getHours(), 2) +
      ":" +
      this.zeroPadding(dateObject.getMinutes(), 2) +
      ":" +
      this.zeroPadding(dateObject.getSeconds(), 2)
    );
  }


  /**
   * レスポンシブでないので注意
   * TODO：OSから判定に切り替える
   */
  $isMobile() {
    return window.matchMedia("(max-width:768px)").matches;
  }

  zeroPadding(num, length) {
    return ("0000000000" + num).slice(-length);
  }
}

Vue.mixin(JpsGlobalMixin);

export function disableScroll() {
  document.documentElement.classList.add("jps-is-clipped");
}

export function enableScroll() {
  document.documentElement.classList.remove("jps-is-clipped");
}

export function getFullPath(path: string) {
  return Config.BASE_PATH + path;
}

export function setLoading(flag: boolean) {
  let jpsElement = document
    .getElementsByClassName("jps-loading-blocker")
    .item(0);
  if (jpsElement) {
    if (flag) {
      jpsElement.classList.add("jps-is-loading");
      window.setTimeout(() => setLoading(false), 10 * 1000);
    } else jpsElement.classList.remove("jps-is-loading");
  }
}

export function isMobile() {
  return window.matchMedia("(max-width:768px)").matches;
}

export function isLoading(): boolean {
  let jpsElement = document
    .getElementsByClassName("jps-loading-blocker")
    .item(0);
  if (jpsElement) {
    jpsElement.classList.contains("jps-is-loading");
  }
  return false;
}

//Href用Directive

function hrefUpdate(el: HTMLElement, binding: VNodeDirective) {
  el.setAttribute("href", Config.BASE_PATH + binding.value);
}

Vue.directive("href", {
  bind: hrefUpdate,
  update: hrefUpdate
});

//Help表示Directive
function helpUpdate(el: HTMLElement, binding: VNodeDirective) {
  if (!equals(binding.value, binding.oldValue)) {
    let prop: Props = {
      content: binding.value.msg,
      animateFill: false,
      trigger: <any>(binding.value.show ? "mouseenter focus" : "manual"),
      // hideOnClick: true,
      performance: true,
      sticky: true,
      arrow: true
    };
    if (!el["_tippy"]) {
      tippy(el, prop);
    } else {
      el["_tippy"].set(prop);
    }
    if (binding.value.initShow) el["_tippy"].show();
    if (!binding.value.show && el["_tippy"]) el["_tippy"].hide();
  }
}

Vue.directive("help", {
  bind: helpUpdate,
  update: helpUpdate,
  unbind: el => {
    if (el["_tippy"]) {
      el["_tippy"].destroy();
    }
  }
});

function tooltipUpdate(el: HTMLElement, binding: VNodeDirective) {
  if (!equals(binding.value, binding.oldValue)) {
    let prop: Props = {
      content: binding.value,
      trigger: "click",
      hideOnClick: true,
      performance: true,
      sticky: true,
      interactive: true,
      arrow: true
    };
    if (!el["_tippy"]) {
      tippy(el, prop);
    } else {
      el["_tippy"].set(prop);
    }
  }
}

Vue.directive("tooltip", {
  bind: tooltipUpdate,
  update: tooltipUpdate,
  unbind: el => {
    if (el["_tippy"]) {
      el["_tippy"].destroy();
    }
  }
});

function hovertipUpdate(el: HTMLElement, binding: VNodeDirective) {
  if (isMobile()) return;
  if (binding.value && !equals(binding.value, binding.oldValue)) {
    let prop: Props = {
      content: binding.value,
      trigger: "mouseenter",
      delay: [1000, 500],
      hideOnClick: true,
      performance: true,
      sticky: true,
      interactive: true,
      arrow: true
    };
    if (!el["_tippy"]) {
      tippy(el, prop);
    } else {
      el["_tippy"].set(prop);
    }
  }
}

Vue.directive("hovertip", {
  bind: hovertipUpdate,
  update: hovertipUpdate,
  unbind: el => {
    if (el["_tippy"]) {
      el["_tippy"].destroy();
    }
  }
});

@Component({
  template: `
    <a @click="click()" :class="{'is-active':value===val}"><slot></slot></a>
  `
})
class VSwitch extends Vue {
  @Prop() val: string;
  @Prop() value: string;

  click() {
    if (this.value !== this.val) {
      this.$emit("input", this.val);
    }
  }
}

Vue.component("v-sw", VSwitch);

@Component({
  template: `
    <a :href="'#'+val" :class="{'is-active':value===val}"><slot></slot></a>
  `
})
class VHashSwitch extends Vue {
  @Prop() val: string;
  @Prop() value: string;
}

Vue.component("v-hsw", VHashSwitch);

//Lang Resource Start
const globalLangResource = {
  "e-system-error": {
    ja:
      "エラーが発生しました。もう一度お試し頂いてもうまく行かない場合にはお問い合わせください。",
    en: "[値はまだない]"
  },
  "m-default-placeholder": {
    ja: "検索キーワードを入力",
    en: "Input search keywords"
  },
  "l-whiten":{ja: "ページを白色化する", en: "whitening and download" },
  "l-fulltextdownload":{ja:"この資料の全文テキストデータ",en:"Full text of this book"},
  "l-imagedownload":{ja:"この資料の画像データ(IIIF API経由)",en:"Image of this book (via IIIF API)"},
  "l-divide":{ja: "見開きで自動分割する", en: "auto divide page" },
  "l-analyze":{ja:"この画像で検索する",en:"Search"},
  "l-news": { ja: "お知らせ", en: "News" },
  "dialog-yes": { ja: "はい", en: "Yes" },
  "dialog-no": { ja: "いいえ", en: "No" },
  "l-num-found": { ja: "{}件見つかりました", en: "{} records found" },
  "button-next": { ja: "次へ", en: "Next" },
  "button-previous": { ja: "前へ", en: "Previous" },
  "button-create": { ja: "作成", en: "Create" },
  "button-save": { ja: "保存", en: "Save" },
  "button-reset": { ja: "リセット", en: "Reset" },
  "button-cancel": { ja: "キャンセル", en: "Cancel" },
  "l-gallery": { ja: "ギャラリー", en: "Gallery" },
  "l-organization": { ja: "連携機関", en: "Organization" },
  "l-add": { ja: "追加", en: "Add" },
  "l-add-of": { ja: "{}の追加", en: "Add {}" },
  "l-add-success": { ja: "{}を追加しました", en: "{} added" },
  "l-cancel": { ja: "キャンセル", en: "Cancel" },
  "l-close": { ja: "閉じる", en: "Close" },
  "l-copy": { ja: "コピー", en: "Copy" },
  "l-create": { ja: "作成", en: "Create" },
  "l-created": { ja: "作成日", en: "Created date" },
  "l-csearch": { ja: "テーマ別検索", en: "Designed Search" },
  "l-database": { ja: "データベース", en: "Database" },
  "l-decide": { ja: "決定", en: "OK" },
  "l-delete": { ja: "削除", en: "Delete" },
  "l-desc": { ja: "説明", en: "Descripiton" },
  "l-finished": { ja: "完了", en: "Finished" },
  "l-id": { ja: "ID", en: "ID" },
  "l-keyword": { ja: "キーワード", en: "Keyword" },
  "l-keyword-or": { ja: "どれか含む", en: "Or" },
  "l-last-updated": { ja: "最終更新日", en: "Last updated" },
  "l-login": { ja: "ログイン", en: "Sign In" },
  "l-logout": { ja: "ログアウト", en: "Sign Out" },
  "l-map": { ja: "地図", en: "Map" },
  "l-metadata-count": { ja: "メタデータ件数", en: "Number of metadata" },
  "l-more": { ja: "もっと見る", en: "Show more" },
  "l-name": { ja: "名前", en: "Name" },
  "l-next": { ja: "次へ", en: "Next" },
  "l-no": { ja: "いいえ", en: "No" },
  "l-note": { ja: "ノート", en: "Note" },
  "l-no-title": { ja: "（タイトル無し）", en: "(No Title)" },
  "l-password": { ja: "パスワード", en: "Password" },
  "l-permission": { ja: "権限", en: "Permission" },
  "l-prev": { ja: "前へ", en: "Prev" },
  "l-save": { ja: "保存", en: "Save" },
  "l-search-history": { ja: "検索履歴", en: "Search History" },
  "l-search-pref": { ja: "検索設定", en: "Search Preference" },
  "l-sort": { ja: "並び替え", en: "Sort" },
  "l-target-db": { ja: "対象データベース", en: "Target databases" },
  "l-title": { ja: "タイトル", en: "Title" },
  "l-unselect": { ja: "未選択にする", en: "Unselect" },
  "l-unselected": { ja: "未選択", en: "Unselected" },
  "l-upload": { ja: "アップロード", en: "Upload" },
  "l-yes": { ja: "はい", en: "Yes" },
  "l-facet": { ja: "画像ファセット", en: "Image Facets" },
  "m-create-success": { ja: "{}を作成しました", en: "{} is created" },
  "m-delete-confirm": { ja: "{}を削除しますか？", en: "Will you delete {}?" },
  "m-delete-fail": {
    ja: "{}を削除できませんでした",
    en: "{} can not be deleted"
  },
  "m-drop-file":{
    ja:"探したい画像をドラッグアンドドロップしてください。類似画像を検索できます。",
    en:"Select illustration to search books that contains similar illustrations"
  },
  "m-loading-model":{
    ja:"モデル読み込み中...",
    en:"Now loading..."
  },
  "zero-hit": {
    ja: "見つかりませんでした(例えばAND検索等により、1文字のキーワードが含まれる場合も検索できません)",
    en: "No hit(For example, if a single keyword is included in an AND search, the search will not work.)"
  },
  "m-delete-success": { ja: "{}を削除しました", en: "{} is deleted" },
  "m-update-success": { ja: "{}を更新しました", en: "{} has been updated" },
  "m-upload-fail": {
    ja: "{}のアップロードに失敗しました",
    en: "{} can not be uploaded"
  },
  "m-upload-success": {
    ja: "{}をアップロードしました",
    en: "{} has been uploaded"
  },
  "tag-graphic":{
    ja: "非写真",
    en: "not Photo"
  },
  "tag-picture":{
    ja: "写真",
    en: "Photo"
  },
  "tag-graphic_illust":{
    ja: "イラスト",
    en: "Graphic"
  },
  "tag-graphic_illustcolor":{
    ja: "カラーイラスト",
    en: "Graphic color"
  },
  "tag-graphic_graph":{
    ja: "グラフ",
    en: "Graph"
  },
  "tag-graphic_map":{
    ja: "地図",
    en: "Map"
  },
  "tag-picture_indoor":{
    ja: "屋内写真",
    en: "Photo(Indoor)"
  },
  "tag-picture_object":{
    ja: "写真(美術品等)",
    en: "Photo(Object)"
  },
  "tag-picture_person":{
    ja: "写真(人物)",
    en: "Photo(Person)"
  },
  "tag-picture_outdoor":{
    ja: "屋外写真",
    en: "Photo(Outdoor)"
  },
  "tag-picture_landmark":{
    ja: "写真(建造物等)",
    en: "Photo(Landmark)"
  },
  "tag-stamp":{
    ja: "印影",
    en: "Stamp"
  },
  "tag-true": {
    ja: "古典籍",
    en: "Classic book",
  },
  "tag-false": {
    ja: "図書",
    en: "Non-classic book",
  },
};
//Lang Resource End
