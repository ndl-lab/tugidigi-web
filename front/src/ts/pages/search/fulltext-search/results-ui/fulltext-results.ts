// Vue とかより先に読み込む必要がある
import Component from "vue-class-component";
Component.registerHooks([
  'metaInfo'
])

import SearchPagesize from "components/search/search-pagesize/search-pagesize";
import SearchPagination from "components/search/search-pagination/search-pagination";
import SearchSortFulltext from "components/search/search-sort/search-sort-fulltext";
import SearchFacet from "components/search/search-facet/search-facet";
import SearchStore from "components/search/search-store/search-store";
import NgramViewer from "pages/search/fulltext-search/ngram-viewer/ngram-viewer";
import { Book } from "domain/book";
import { Illustration } from "domain/illustration";
import { Prop } from "vue-property-decorator";
import { searchBook,searchNgramBook} from "service/book-service";
import {
  getIllustrationsByBook,
  getIllustration,
  getIllustrations
} from "service/illust-service";
import Vue from "vue";
import BookEntry from "../../book_entry";
import IllustImage from "../../illust-image/illust-image";
import "./fulltext-results.scss";
import { generateTitle } from "utils/url";

var VueScrollTo = require("vue-scrollto");

@Component({
  template: require("./fulltext-results.html"),
  components: {
    BookEntry,
    IllustImage,
    SearchPagination,
    SearchPagesize,
    SearchSortFulltext,
    NgramViewer,
    SearchFacet
  }
})
export default class FullTextSearchResultsPage extends Vue {
  ss: SearchStore<Book> = null;
  ssngram: SearchStore<Book> = null;
  
  activeTab: number = 0;
  showFacet: boolean = false;
  imageOnly: boolean = false;
  imageSelect: string = null;
  @Prop()
  withoutimgflag:boolean;
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
      if(!this.withoutimgflag)result.list.forEach(async book => {
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
    if (this.ss.image && this.ss.image.length > 0&&!this.withoutimgflag) {
      this.qillust = (await getIllustration(this.ss.image[0])).data;
    }
  }

  imageSearch(i: Illustration) {
    this.ss.keywords = [];
    this.ss.image = [i.id];
    this.ss.execute();
    this.qillust = i;
  }

  metaInfo() {
    return this.ss.keywords.length !== 0 ? {
      title: generateTitle({
        subTitle: this.$l2(
          `「${this.ss.keywords.join(" ")}」の検索結果` ,
          `Result for "${this.ss.keywords.join(" ")}"`
        )
      })
    } : {}
  }
}
