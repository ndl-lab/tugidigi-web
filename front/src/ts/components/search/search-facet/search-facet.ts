import SearchStore from "components/search/search-store/search-store";
import { ItemFacet } from "service/search-utils";
import { MyVue } from "types";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import "./search-facet.scss";

export default interface SearchFacet extends MyVue {}
const DEFAULT_LEN = 5;

@Component({
  name: "SearchFacet",
  template: require("./search-facet.html"),
  components: {}
})
export default class SearchFacet extends Vue {
  @Prop({ required: true })
  facet: ItemFacet;
  @Prop({ required: true })
  ss: SearchStore<any>;
  @Prop({ default: DEFAULT_LEN })
  facetLength: number;

  //Data
  showFacet: boolean = true;
  showAll: boolean = false;

  get hasFacet() {
    return (
      Object.keys(this.facet.counts).length > 0 || this.notFacets.length > 0
    );
  }

  get sortedFacet(): { [key: string]: number } {
    let obj = {};
    let keys = Object.keys(this.facet.counts).filter(k => k !== "various");
    keys = keys.sort((a, b) => this.facet.counts[b] - this.facet.counts[a]);
    keys.forEach(key => {
      obj[key] = this.facet.counts[key];
    });
    return obj;
  }

  created() {
    this.$registerComponentLang(localLangResource);
  }

  async beforeMount() {}

  select(value: string) {
    if (this.isSelected(value)) {
      this.ss.removeFacet(this.facet.field, [value]);
    } else {
      this.ss.addFacet(this.facet.field, [value]);
    }
  }

  exclude(value: string) {
    this.select("-" + value);
  }

  get notFacets(): string[] {
    if (this.ss.facet && this.ss.facet[this.facet.field]) {
      return this.ss.facet[this.facet.field]
        .filter(value => value.startsWith("-"))
        .map(value => value.substring(1));
    }
    return [];
  }

  isShown(index: number) {
    return this.showAll || index < this.facetLength;
  }

  get facetsRemains(): number {
    return Object.keys(this.facet.counts).length - this.facetLength;
  }

  isShowHideButton() {
    return this.facetsRemains > 0;
  }

  isSelected(value: string): boolean {
    if (this.ss.facet && this.ss.facet[this.facet.field]) {
      return this.ss.facet[this.facet.field].includes(value);
    }
    return false;
  }
}

//Lang Resource Start
const localLangResource = {
  "label-exclude": { ja: "除外", en: "Exclude" },
  "label-show-all": { ja: "残り{}件も表示", en: "Show Remaining {}" },
  "label-hide": { ja: "隠す", en: "Hide" },
  "h-not-facet": {
    ja: "検索結果から除外します",
    en: "Exclude from search result"
  },
  "l-exclude": { ja: "除外", en: "Exclude" },
  "l-hide": { ja: "隠す", en: "Hide" },
  "l-show-remains": { ja: "残り{}件も表示", en: "Show Remaining {}" }
};
//Lang Resource End
