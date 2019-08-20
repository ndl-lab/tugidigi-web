import IiifViewer from "components/iiif-viewer/iiif-viewer";
import { Book } from "domain/book";
import { getBook } from "service/book-service";
import Vue from "vue";
import Component from "vue-class-component";
import VueSlider from "vue-slider-component";
import "./book.scss";
import PageSearch from "./page-search/page-search";
import { Watch } from "vue-property-decorator";
import IllustSearch from "./illust-search/illust-search";

@Component({
  components: {
    IiifViewer,
    PageSearch,
    VueSlider,
    IllustSearch
  },
  template: require("./book.html")
})
export default class BookView extends Vue {
  b: Book = null;
  activeTab: number = 0;

  table: string = "";
  colors: string = `0 1 0 0 0
0 1 0 0 0
0 1 0 0 0
0 1 0 1 0`;

  bwflag: boolean = false;
  menuflag: boolean = true;
  isMetadata: boolean = true;
  mono: boolean = true;

  async mounted() {
    this.viwer.setManifest(
      `https://www.dl.ndl.go.jp/api/iiif/${this.id}/manifest.json`,
      this.page
    );
    this.b = await getBook(this.id);
  }

  get viwer(): IiifViewer {
    return <IiifViewer>this.$refs.viewer;
  }

  get totalPage() {
    return this.viwer.totalPage;
  }

  th: number = 161;
  showThParam: boolean = false;

  get filterParams() {
    let param: string = "";
    let a = 10;
    if (this.table && this.table.substring(0, 1) === "a") {
      a = Number(this.table.substring(1));
    } else if (this.table) {
      return this.table;
    }
    for (let r = 0; r < 256; r++) {
      if (r !== 0) param += " ";
      //            if (r < this.th  / 2) param += "0";
      //            if (r > this.th * 1.5) param += "1";
      //            else param += (1.0 / (1.0 + Math.exp(-a * (r - this.th) / 255)));
      let p = 1.0 / (1.0 + Math.exp((-a * (r - this.th)) / 255));
      //            if (p > 0.85) p = 1;
      param += p;
    }
    return param;
  }

  get id() {
    return this.$route.params["id"];
  }

  @Watch("page")
  watchPage(neu) {
    this.viwer.setPage(neu);
  }

  get page(): number {
    return Number(this.$route.query["page"]);
  }

  set page(newPage: number) {
    this.$router.replace({ query: { page: String(newPage) } });
  }

  get keywords(): string[] {
    if (this.$route.query) {
      if (this.$route.query.length) {
        return <string[]>this.$route.query["keyword"];
      }
      return [<string>this.$route.query["keyword"]];
    }
    return [];
  }
  changeAutoTOC() {
    this.isMetadata = !this.isMetadata;
  }
  get index() {
    if (!this.b.index) return null;
    return this.b.index
      .map(i => {
        let is = i.split("/");
        let k = null;
        try {
          k = Number(/\(0*(\d+)\./.exec(is[1])[1]);
        } catch (e) {
          k = null;
        }
        return {
          name: is[0].trim(),
          pg: k
        };
      })
      .sort(function(a, b) {
        if (Number(a.pg) <= Number(b.pg)) return -1;
        if (Number(a.pg) > Number(b.pg)) return 1;
        return 0;
      });
  }
  get autoTOCindex() {
    if (!this.b.autoTOCindex) return null;
    return this.b.autoTOCindex
      .map(i => {
        let is = i.split("/");
        let k = null;
        try {
          k = Number(/\(0*(\d+)\./.exec(is[1])[1]);
        } catch (e) {
          k = null;
        }
        return {
          name: is[0].trim(),
          pg: k
        };
      })
      .sort(function(a, b) {
        if (Number(a.pg) <= Number(b.pg)) return -1;
        if (Number(a.pg) > Number(b.pg)) return 1;
        return 0;
      });
  }

  pageSelected(newPage: number) {
    this.page = newPage;
    this.pagesActive = false;
  }

  pagesActive: boolean = false;
}
