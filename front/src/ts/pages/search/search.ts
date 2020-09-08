import SearchPagesize from "components/search/search-pagesize/search-pagesize";
import SearchPagination from "components/search/search-pagination/search-pagination";
import SearchSort from "components/search/search-sort/search-sort";
import SearchStore from "components/search/search-store/search-store";
import { Book } from "domain/book";
import { Illustration } from "domain/illustration";
import { searchBook } from "service/book-service";
import {
  getIllustrationsByBook,
  getIllustration,
  getIllustrations
} from "service/illust-service";
import Vue from "vue";
import Component from "vue-class-component";
import BookEntry from "./book_entry";
import IllustImage from "./illust-image/illust-image";
//import SearchControl from "./search-control/search-control";
import FulltextSearch from "pages/search/fulltext-search/search-ui/fulltext-search";
import IllustSearch from "pages/search/illust-search/search-ui/illust-search";
import "./search.scss";

var VueScrollTo = require("vue-scrollto");

@Component({
  template: require("./search.html"),
  components: {
    FulltextSearch,
    IllustSearch,
    BookEntry,
    IllustImage,
    SearchPagination,
    SearchPagesize,
    SearchSort
  }
})
export default class SearchPage extends Vue {
  ss: SearchStore<Book> = null;
  activeTab: number = 0;
  showFacet: boolean = false;
  imageOnly: boolean = false;

  imageSelect: string = null;

  show(i: Illustration) {
    this.$router.push({
      name: "book",
      params: { id: i.pid },
      query: { page: String(i.page) }
    });
  }

  beforeMount() {
    this.ss = new SearchStore(searchBook, true);
    this.ss.addAfterSearchListener(result => {
      result.list.forEach(async book => {
        if (book.illustrations) {
          this.$set(
            book,
            "illusts",
            (await getIllustrations(book.illustrations)).data
          );
        } else {
          this.$set(
            book,
            "illusts",
            (await getIllustrationsByBook(book.id)).data.list
          );
        }
      });
      VueScrollTo.scrollTo(".search-nav", 300, {});
    });
  }

  get keyword() {
    return this.ss.keywords.join(" ");
  }

  qillust: Illustration = null;

  get illusts() {
    let i = [];
    this.ss.result.list.forEach(b => i.push(...b.illusts));
    return i;
  }

  async mounted() {
    this.ss.restoreQuery();
    if (this.ss.image && this.ss.image.length > 0) {
      this.qillust = (await getIllustration(this.ss.image[0])).data;
    }
  }

  imageSearch(i: Illustration) {
    this.ss.keywords = [];
    this.ss.image = [i.id];
    this.ss.execute();
    this.qillust = i;
  }

  keywordSearch(keywords: string[]) {
    console.log(keywords);
    this.ss.image = [];
    this.ss.keywords = keywords;
    this.ss.execute();
  }
}
