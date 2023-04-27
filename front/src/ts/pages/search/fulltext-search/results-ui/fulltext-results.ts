import SearchPagesize from "components/search/search-pagesize/search-pagesize";
import SearchPagination from "components/search/search-pagination/search-pagination";
import SearchSortFulltext from "components/search/search-sort/search-sort-fulltext";
import SearchStore from "components/search/search-store/search-store";
import NgramViewer from "pages/search/fulltext-search/ngram-viewer/ngram-viewer";
import { Book } from "domain/book";
import { Illustration } from "domain/illustration";
import { searchBook,searchNgramBook} from "service/book-service";
import {
  getIllustrationsByBook,
  getIllustration,
  getIllustrations
} from "service/illust-service";
import Vue from "vue";
import Component from "vue-class-component";
import BookEntry from "../../book_entry";
import IllustImage from "../../illust-image/illust-image";
import "./fulltext-results.scss";

var VueScrollTo = require("vue-scrollto");

@Component({
  template: require("./fulltext-results.html"),
  components: {
    BookEntry,
    IllustImage,
    SearchPagination,
    SearchPagesize,
    SearchSortFulltext,
    NgramViewer
  }
})
export default class FullTextSearchResultsPage extends Vue {
  ss: SearchStore<Book> = null;
  ssngram: SearchStore<Book> = null;
  
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
    this.ssngram = new SearchStore(searchNgramBook, true);
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
  get fulltextflag(){
    if(this.ss.searchfield.includes("contentonly"))return true;
    else false;
  }

  qillust: Illustration = null;

  get illusts() {
    let i = [];
    this.ss.result.list.forEach(b => i.push(...b.illusts));
    return i;
  }
  async ngramsearch(){
    this.ssngram.restoreQuery();  
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
}
