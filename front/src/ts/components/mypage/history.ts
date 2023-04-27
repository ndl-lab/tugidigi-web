import Vue from "vue";
import { searchBook } from "service/book-service";
import BookEntry from "pages/search/book_entry";
import SearchStore from "components/search/search-store/search-store";
import Component from "vue-class-component";
import { Book } from "domain/book";
import { fromQueryString } from "service/search-utils";
import {
  getIllustrationsByBook,
  getIllustrations,
} from "service/illust-service";
import { Watch } from "vue-property-decorator";
import VueScrollTo from "vue-scrollto"

import "./history.scss";
import { retreiveViewedBookHistory, tryLocalStorageAvailable } from "utils/localstorage";

@Component({
  template: require("./history.html"),
  components: {
    BookEntry,
  },
})
export default class History extends Vue {
  viewedBookHistoryIds: string[] = [];
  ss: SearchStore<Book> = null;
  isLocalStorageAvailable: boolean = true;
  keywordBuffer: string = "";

  get keyword(): string {
    const keyword = this.$route.query.history_keyword || ""
    if(Array.isArray(keyword) === true) return keyword[0]
    return keyword as string
  }

  beforeMount() {
    this.keywordBuffer = this.keyword
    this.ss = new SearchStore(searchBook, true);
    this.ss.addAfterSearchListener((result) => {
      result.list.forEach(async (book) => {
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
  mounted() {
    // localstorage 使えるかな？
    this.isLocalStorageAvailable = tryLocalStorageAvailable();
    if (this.isLocalStorageAvailable === false) return;

    this.viewedBookHistoryIds = retreiveViewedBookHistory()
    this.searchBooksByHistoryIds();
  }

  get sortedBookList(): Book[] {
    return (
      this.viewedBookHistoryIds
        .map((id) => {
          return this.ss.result?.list.find((book) => book.id === id);
        })
        .filter((b) => b !== undefined) || []
    );
  }

  get current() {
    const page = this.$route.query.history_page 
    if(page === undefined) {
      return 1
    }
    return Number(page)
  }

  searchBooksByHistoryIds() {
    const query = new URLSearchParams() 
    this.viewedBookHistoryIds.forEach((id) => {
      query.append("f-id", id)
    })
    if (this.keyword.length > 1) {
      this.keyword.split(/[\s　]+/).forEach(splittedWord => {
        query.append("keyword", splittedWord);
      })
    }
    query.append("from", `${(this.current - 1) * 5}`)
    query.append("size", "5")
    const queryObj = fromQueryString(`?${query.toString()}`);
    this.ss.restoreQuery(queryObj);
  }

  searchBooksByKeyowrd() {
    this.$router.push({
      query: {
        history_page: "1",
        history_keyword: this.keywordBuffer
      }
    })
    this.searchBooksByHistoryIds()
  }

  changePage(pageNumber: number) {
    this.$router.push({
      query: {
        history_page: `${pageNumber}`,
        history_keyword: this.keywordBuffer
      },
      hash: "viewed-book-history"
    })
  }

  @Watch("current")
  watchCurrentPage(_current: number) {
    this.ss.clear();
    this.searchBooksByHistoryIds();
    VueScrollTo.scrollTo("#viewed-book-history")
  }
}
