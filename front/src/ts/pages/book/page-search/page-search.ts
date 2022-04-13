import SearchPagination from "components/search/search-pagination/search-pagination";
import SearchStore from "components/search/search-store/search-store";
import { Illustration } from "domain/illustration";
import { Page } from "domain/page";
import { searchPage } from "service/page-service";
import Vue from "vue";
import Component from "vue-class-component";
import "./page-search.scss";
import { Watch, Prop } from "vue-property-decorator";
import { Book } from "domain/book";

@Component({
  template: require("./page-search.html"),
  components: {
    SearchPagination
  }
})
export default class PageSearch extends Vue {
  @Prop()
  book: Book;

  @Prop()
  keywords: string[];

  keyword: string = "";

  get keywords2() {
    return this.keyword.split(/[\s　]+/);
  }

  ss: SearchStore<Page> = null;

  async beforeMount() {
    this.ss = new SearchStore(searchPage, false);
    this.ss.filter = { book: [this.book.id] };
    if (this.keywords) this.keyword = this.keywords.join(" ");
    this.keywordSearch();
  }
  keywordSearch() {
    if (this.keyword) {
      this.ss.query = { contents: this.keyword.split(/[\s　]+/) };
      var query = Object.assign({}, this.$route.query);
      this.ss.execute();
      if (query["keyword"]!=this.keyword) {
        query["keyword"]=this.keyword;
        this.$router.replace({ query: query});
        this.$router.go(0);
      }     
    }
  }
}
