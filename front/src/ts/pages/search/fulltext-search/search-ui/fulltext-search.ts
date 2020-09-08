import { SearchResult } from "service/search-utils";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import "./fulltext-search.scss";

@Component({
  template: require("./fulltext-search.html"),
})
export default class FulltextSearch extends Vue {

  @Prop({ default: "" })
  keyword: string;
  keywordSearch() {
    this.$router.push({
      name: "fulltextsearchres",
      query: { keyword: this.keyword.split(/[\s　]+/) }
    });
    this.$router.go(0);//強制リロード
  }
}
