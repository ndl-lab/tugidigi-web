import Vue from "vue";
import Component from "vue-class-component";
import SearchStore from "components/search/search-store/search-store";
import { Prop } from "vue-property-decorator";
import { MyVue } from "types";
import { LangString } from "domain/common";

import "./search-sort.scss";

export default interface SearchSort extends MyVue {}

export interface SortOption {
  name: LangString;
  index: string;
  asccend: boolean;
}

@Component({
  name: "SearchSort",
  template: require("./search-sort.html")
})
export default class SearchSort extends Vue {
  @Prop() ss: SearchStore<any>;

  @Prop() options: SortOption[];

  created() {
    this.$registerComponentLang(localLangResource);
  }

  changeSort(sort: any) {
    if (sort.target.value) {
      this.ss.setSort([sort.target.value]);
    } else {
      this.ss.setSort(null);
    }
  }

  changeSortIE() {
    let value = this.$el.getElementsByTagName("select")[0].value;
    if (value) {
      this.ss.setSort([value]);
    } else {
      this.ss.setSort(null);
    }
  }
}

//Lang Resource Start
const localLangResource = {
  "label-sort": { ja: "並び替え", en: "Sort" },
  "l-sort-default": { ja: "類似度順", en: "Score" },
  "l-sort-confidence": { ja: "ラベルの確信度順", en: "Label Confidence" }
};
//Lang Resource End
