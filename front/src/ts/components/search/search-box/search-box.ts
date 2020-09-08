import SearchStore from "components/search/search-store/search-store";
import { MyVue } from "types";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import "./search-box.scss";
export default interface SearchBox extends MyVue {}

@Component({
  name: "SearchBox",
  components: {},
  template: require("./search-box.html")
})
export default class SearchBox extends Vue {
  //props
  @Prop() ss: SearchStore<any>;

  @Prop({ default: false })
  noheader: boolean;

  @Prop({ default: false })
  simple: boolean;

  @Prop({ default: false })
  detailed: boolean;

  @Prop({ default: false })
  initialdetail: boolean;

  showDetail: boolean = false;

  keyword: string = "";

  notKeyword: string = "";

  keywordType: "AND" | "OR" = "AND";

  focus() {
    const inputs = this.$el.getElementsByClassName("keyword-input");

    if (inputs) {
      this.$nextTick(() => {
        (<HTMLElement>inputs[0]).focus();
      });
    }
  }

  beforeMount() {
    this.$registerComponentLang(localLangResource);
    this.ss.addQueryListenr(ss => {
      if (ss.keywords) {
        this.keyword = ss.keywords.filter(k => !k.startsWith("-")).join(" ");
        this.notKeyword = ss.keywords
          .filter(k => k.startsWith("-"))
          .map(k => k.substr(1))
          .join(" ");
      } else {
        this.keyword = "";
        this.notKeyword = "";
      }
      this.keywordType = this.ss.keywordType;
      // this.showDetail = false;
    });
    this.showDetail = this.initialdetail;
  }

  doSearch() {
    this.ss.from = 0;
    this.ss.facet = {};
    if (!this.detailed) {
      let sendKeyword = this.keyword.split(/[\s　]+/);
      if (this.notKeyword)
        sendKeyword.push(...this.notKeyword.split(/[\s　]+/).map(k => "-" + k));
      this.ss.keywords = sendKeyword;
      this.ss.keywordType = this.keywordType;
    }
    this.ss.execute(this.showDetail || this.detailed, r => {
      this.$notifyError(this.$l("m-search-error"));
    });
  }
}

//Lang Resource Start
const localLangResource = {
  "l-placeholder-not-keyword": { ja: "除外キーワード", en: "Not Keywords" },
  "l-keyword-and": { ja: "すべて含む", en: "And" },
  "l-keyword-or": { ja: "どれか含む", en: "Or" },
  "m-search-error": {
    ja: "検索に失敗しました。もう一度お試し下さい。",
    en: "Search failed. Please try again."
  },
  "l-detail": { ja: "詳細", en: "Detail" }
};
//Lang Resource End
