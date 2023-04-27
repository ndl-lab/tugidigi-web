// Vue とかより先に読み込む必要がある
import Component from "vue-class-component";
Component.registerHooks(["metaInfo"]);

import Vue from "vue";
import BookEntry from "pages/search/book_entry";
import History from "components/mypage/history";
import TaggedBooks from "components/mypage/tagged-book";
import { generateTitle } from "utils/url";

export default interface SearchSortFulltext extends MyVue {}

import "./mypage.scss";
import { MyVue } from "types";
import { Watch } from "vue-property-decorator";
import {
  isViewedBookHistoryDisabled,
  retreiveFulltextDefaultSort,
  setFulltextDefaultSort,
  setIsViewedBookHistoryDisabled,
  tryLocalStorageAvailable,
  checkHistoryPermission,
  setHistoryPermission
} from "utils/localstorage";

@Component({
  template: require("./mypage.html"),
  components: {
    BookEntry,
    History,
    TaggedBooks
  },
})
export default class Mypage extends Vue {
  fulltextSortOrder: string = "";
  isLocalStorageAvailable: boolean = true;
  viewedBookHistoryDisabled: boolean = false;

  created() {
    this.$registerComponentLang(localLangResource);
  }

  async mounted() {
    this.isLocalStorageAvailable = tryLocalStorageAvailable();
    if (this.isLocalStorageAvailable === true) {
      this.fulltextSortOrder = retreiveFulltextDefaultSort();
      if(checkHistoryPermission()){
        this.viewedBookHistoryDisabled = isViewedBookHistoryDisabled();
      }else{
        this.viewedBookHistoryDisabled =true;
      }
    }
  }

  @Watch("fulltextSortOrder")
  fulltextSortOrderHandler(current: string) {
    setFulltextDefaultSort(current);
  }

  viewdBookHistoryDisabledHandler(value: "true" | "false"){
    const toDisabled = value === "true" ? true : false;
    if (toDisabled) {
      const confirmed = confirm(
        this.$l2(
          "無効にするとこれまで履歴がすべてリセットされます。",
          "When you disable, current history is cleared."
        )
      );
      console.log(confirmed);
      if (confirmed === true){
        this.switchHistory(toDisabled);
      }else{
        this.$router.go(0);
      }
    }else if(!checkHistoryPermission()){
      const confirmed = confirm(
        this.$l2(
          "閲覧履歴はWebブラウザのローカルストレージに保存されます。共有PC等では、他の利用者にも履歴が表示されますので、その点をご理解のうえご使用ください。",
          "The function is saved in the local storage of the Web browser. Please understand that the history will be displayed to other users on shared PCs, and so on."
        )
      );
      if(confirmed === true){
        setHistoryPermission();
        this.switchHistory(toDisabled);
      }else{
        this.$router.go(0);
      }
    }else{
      this.switchHistory(toDisabled);
    }
  }
  switchHistory(toDisabled:boolean){
    const result = setIsViewedBookHistoryDisabled(toDisabled);
    this.viewedBookHistoryDisabled = toDisabled;
    if (result === true) {
      // 閲覧履歴とかを再表示する
      this.$router.go(0);
    }
  }

  metaInfo() {
    return {
      title: generateTitle({
        subTitle: this.$l2("マイページ", "Mypage"),
      }),
    };
  }
}

//Lang Resource Start
const localLangResource = {
  "field-label-sort": { ja: "全文検索結果の並び順", en: "Fulltext Search Sort" },
  "label-sort": { ja: "並び替え", en: "Sort" },
  "l-sort-default": { ja: "一致度順", en: "Relevance" },
  "l-sort-publishyear-asc": {
    ja: "刊行年代順（昇順）",
    en: "Publish Year(ascend)",
  },
  "l-sort-publishyear-desc": {
    ja: "刊行年代順（降順）",
    en: "Publish Year(descend)",
  },
  "field-label-history": { ja: "閲覧履歴を保存する", en: "History Setting" },
  "label-history": { ja: "閲覧履歴設定", en: "History Setting" },
};
//Lang Resource End
