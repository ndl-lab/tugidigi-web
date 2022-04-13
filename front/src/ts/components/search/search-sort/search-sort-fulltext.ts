import Vue from "vue";
import Component from "vue-class-component";
import SearchStore from "components/search/search-store/search-store";
import { Prop } from "vue-property-decorator";
import { MyVue } from "types";
import { LangString } from "domain/common";

import "./search-sort.scss";

export default interface SearchSortFulltext extends MyVue {}

export interface SortOption {
  name: LangString;
  index: string;
  asccend: boolean;
}

@Component({
  name: "SearchSortFulltext",
  template: require("./search-sort-fulltext.html")
})
export default class SearchSortFulltext extends Vue {
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
  "l-sort-default": { ja: "一致度順", en: "Relevance" },
  "l-sort-publishyear-asc": { ja: "刊行年代順（昇順）", en: "Publish Year(ascend)" },
  "l-sort-publishyear-desc": { ja: "刊行年代順（降順）", en: "Publish Year(descend)" }
};
//Lang Resource End
