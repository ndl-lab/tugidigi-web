import SearchPagination from "components/search/search-pagination/search-pagination";
import SearchStore from "components/search/search-store/search-store";
import SearchFacet from "components/search/search-facet/search-facet";
import { ItemFacet } from "service/search-utils";
import { Book } from "domain/book";
import { Illustration } from "domain/illustration";
import IllustImage from "pages/search/illust-image/illust-image";
import { searchIllustration } from "service/illust-service";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import "./illust-search.scss";

@Component({
  template: require("./illust-search.html"),
  components: {
    SearchPagination,
    SearchFacet,
    IllustImage
  }
})
export default class IllustSearch extends Vue {
  @Prop()
  book: Book;

  ss: SearchStore<Illustration> = null;
  

  search(i) {
    console.log(i);
     this.$router.push({
      name: "illustsearchres",
      query: { image: [String(i.id)]}
    });
    /*this.$router.push({
      name: "search",
      query: { image: String(i.id) }
    });*/
  }

  show(i) {
    this.$router.push({
      name: "book",
      params: { id: i.pid },
      query: { page: String(i.page) }
    });
  }

  beforeMount() {
    this.ss = new SearchStore(searchIllustration, false);
    this.ss.filter = { pid: [this.book.id] };
    this.ss.sort = ["page:ASC"];
    this.ss.size = 20;
    this.ss.execute();
  }
}
