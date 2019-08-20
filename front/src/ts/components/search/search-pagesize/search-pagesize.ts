import SearchStore from "components/search/search-store/search-store";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { MyVue } from "types";
export default interface SearchPagesize extends MyVue {}

@Component({
  name: "SearchPagesize",
  template: require("./search-pagesize.html")
})
export default class SearchPagesize extends Vue {
  @Prop({ default: false })
  manual: boolean;

  @Prop()
  ss: SearchStore<any>;

  innnerSize = 0;
  values = ["10", "20", "50"];

  sizeChange(event) {
    this.ss.setSize(event.target.value);
    this.$emit("size-change", event.target.value);
  }

  get size() {
    return this.ss.size;
  }

  go() {
    this.ss.setSize(this.innnerSize);
  }

  set size(s) {
    this.innnerSize = s;
  }

  created() {
    this.$registerComponentLang(localLangResource);
  }
}

//Lang Resource Start
const localLangResource = {
  "label-pagesize": { ja: "表示件数", en: "# of List" },
  "l-apply": { ja: "反映", en: "Apply" },
  "l-num-of-rows": { ja: "{}件", en: "{}" }
};
//Lang Resource End
