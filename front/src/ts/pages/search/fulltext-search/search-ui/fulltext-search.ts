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
  @Prop({ default: false })
  fulltextflag: boolean;
  keywordSearch() {
    if(!this.fulltextflag){
      this.$router.push({
        name: "fulltextsearchres",
        query: { keyword: this.keyword.split(/[\s　]+/),searchfield:""}
      });
    }else{//searchfield
      this.$router.push({
        name: "fulltextsearchres",
        query: { keyword: this.keyword.split(/[\s　]+/),searchfield:"contentonly"}
      });
    }
    this.$router.go(0);//強制リロード
  }
}
