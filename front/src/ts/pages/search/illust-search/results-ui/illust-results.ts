import SearchPagesize from "components/search/search-pagesize/search-pagesize";
import SearchPagination from "components/search/search-pagination/search-pagination";
import SearchSort from "components/search/search-sort/search-sort";
import SearchStore from "components/search/search-store/search-store";
import SearchFacet from "components/search/search-facet/search-facet";
import { Prop,Watch} from "vue-property-decorator";
import { Book } from "domain/book";
import { Illustration } from "domain/illustration";
import { searchBook,searchmetaBook } from "service/book-service";
import { searchIllustration } from "service/illust-service";
import {
  getIllustrationsByBook,
  getIllustration,
  getIllustrations,
  searchEachIllustration
} from "service/illust-service";
import Vue from "vue";
import Component from "vue-class-component";
import BookEntry from "../../book_entry";
import IllustImage from "../../illust-image/illust-image";
import IllustSearch from "pages/search/illust-search/search-ui/illust-search";
import "./illust-results.scss";

var VueScrollTo = require("vue-scrollto");

@Component({
  template: require("./illust-results.html"),
  components: {
    IllustSearch,
    BookEntry,
    IllustImage,
    SearchPagination,
    SearchPagesize,
    SearchSort,
    SearchFacet
  }
})
export default class IllustSearchResultsPage extends Vue {
  ss: SearchStore<Illustration> = null;
  ssBook: SearchStore<Book> = null;
  showFacet: boolean = false;
  activetab: number=0;
  keywords:string[];
  changeTab(activetab){
    this.activetab=activetab;
  }

  show(i: Illustration) {
    let routeData = this.$router.resolve({
        name: "book",
      params: { id: i.pid },
      query: { page: String(i.page) }
    });
    window.open(routeData.href, '_blank');
  }

  beforeMount() {
    this.ss = new SearchStore(searchEachIllustration, true);
    this.ss.addAfterSearchListener(result => {
      VueScrollTo.scrollTo(".search-nav", 300, {});
    });
    this.ssBook = new SearchStore(searchmetaBook, true);
    this.ssBook.addAfterSearchListener(result => {
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
    });
  }

  get keyword() {
    return this.ssBook.keywords.join(" ");
  }
  
  //@Prop()
  qillust: Illustration=null;

  get illusts() {
    let i = [];
    //console.log(this.ss.result.list);
    this.ss.result.list.forEach(b => i.push(b));
    return i;
  }
  
  async mounted() {
    this.ss.restoreQuery();
    this.ssBook.restoreQuery();
    if (this.ss.image && this.ss.image.length > 0) {
      this.qillust = (await getIllustration(this.ss.image[0])).data;
    }else if(this.ssBook.keywords){
      this.activetab=1;
    }
    this.$refs.searchtab.changeTab(this.activetab);
  }
  keywordSearch(keywords: string[]) {
    this.ssBook.image = [];
    this.ssBook.keywords = keywords;
    this.ssBook.execute();
    this.keywords = keywords;
  }
  
  imageSearch(i: Illustration) {
    this.ss.keywords = [];
    this.ss.image = [i.id];
    this.ss.from = 0;//ページネーションをリセット
    this.ss.execute();
    this.qillust = i;
  }
  
}
