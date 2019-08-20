import { AxiosPromise } from "axios";
import * as Config from "config";
import { LangString } from "domain/common";
import { AppState, state, setTitle } from "model/state";
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

  $isEmpty(v: any): boolean;
  $join(arr: string[] | string): string;

  $scrollToTop();
  $scrollToSearchResult();
  $disableScroll();
  $enableScroll();

  $setLoading(flag: boolean);
  $isLoading(): boolean;

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

export interface LangResource {
  [key: string]: LangString;
}

@Component({})
class GlobalMixin extends Vue {
  @Prop() $langOverride: LangResource;

  $langResource: LangResource = null;

  get $state(): AppState {
    return state;
  }

  mounted() {
    setTitle(this.$state.lang);
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
      this.$dialog.confirm({
        message: msg,
        confirmText: this.$l("l-yes"),
        cancelText: this.$l("l-no"),
        onConfirm: resolve,
        onCancel: reject
      });
    });
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

  $registerComponentLang(langResource: LangResource) {
    this.$langResource = Object.assign(this.$langResource || {}, langResource);
  }

  $arrayremove(array: any[], value: any) {
    let index = array.indexOf(value);
    if (index >= 0) this.$delete(array, index);
  }

  $scrollToTop() {
    window.scrollTo(0, 0);
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

  beforeRouteEnter(to, from, next) {
    next(vm => {
      (<any>vm).setTitle();
    });
  }

  $isMobile() {
    return window.matchMedia("(max-width:768px)").matches;
  }

  zeroPadding(num, length) {
    return ("0000000000" + num).slice(-length);
  }
}

Vue.mixin(GlobalMixin);

export function getFullPath(path: string) {
  return Config.BASE_PATH + path;
}

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
  "l-organization": { ja: "連携機関", en: "Organization" },
  "l-add": { ja: "追加", en: "Add" },
  "l-add-of": { ja: "{}の追加", en: "Add {}" },
  "l-add-success": { ja: "{}を追加しました", en: "{} added" },
  "l-cancel": { ja: "キャンセル", en: "Cancel" },
  "l-close": { ja: "閉じる", en: "Close" },
  "l-copy": { ja: "コピー", en: "Copy" },
  "l-create": { ja: "作成", en: "Create" },
  "l-created": { ja: "作成日", en: "Created date" },
  "l-decide": { ja: "決定", en: "OK" },
  "l-delete": { ja: "削除", en: "Delete" },
  "l-desc": { ja: "説明", en: "Descripiton" },
  "l-finished": { ja: "完了", en: "Finished" },
  "l-id": { ja: "ID", en: "ID" },
  "l-keyword": { ja: "キーワード", en: "Keyword" },
  "l-keyword-or": { ja: "どれか含む", en: "Or" },
  "l-last-updated": { ja: "最終更新日", en: "Last updated" },
  "l-map": { ja: "地図", en: "Map" },
  "l-metadata-count": { ja: "メタデータ件数", en: "Number of metadata" },
  "l-more": { ja: "もっと見る", en: "Show more" },
  "l-name": { ja: "名前", en: "Name" },
  "l-next": { ja: "次へ", en: "Next" },
  "l-no": { ja: "いいえ", en: "No" },
  "l-no-title": { ja: "（タイトル無し）", en: "(No Title)" },
  "l-prev": { ja: "前へ", en: "Prev" },
  "l-save": { ja: "保存", en: "Save" },
  "l-search-history": { ja: "検索履歴", en: "Search History" },
  "l-search-pref": { ja: "検索設定", en: "Search Preference" },
  "l-sort": { ja: "並び替え", en: "Sort" },
  "l-title": { ja: "タイトル", en: "Title" },
  "l-unselect": { ja: "未選択にする", en: "Unselect" },
  "l-unselected": { ja: "未選択", en: "Unselected" },
  "l-upload": { ja: "アップロード", en: "Upload" },
  "l-yes": { ja: "はい", en: "Yes" },
  "m-create-success": { ja: "{}を作成しました", en: "{} is created" },
  "m-delete-confirm": { ja: "{}を削除しますか？", en: "Will you delete {}?" },
  "m-delete-fail": {
    ja: "{}を削除できませんでした",
    en: "{} can not be deleted"
  },
  "zero-hit": {
    ja: "見つかりませんでした",
    en: "No hit"
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
  }
};
//Lang Resource End
