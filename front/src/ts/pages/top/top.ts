// Vue とかより先に読み込む必要がある
import Component from "vue-class-component";
Component.registerHooks([
  'metaInfo'
])
import * as Config from "config";
//import SearchControl from "pages/search/search-control/search-control";
import FulltextSearch from "pages/search/fulltext-search/search-ui/fulltext-search";
import IllustSearch from "pages/search/illust-search/search-ui/illust-search";
import Vue from "vue";
import "./top.scss";
import { Illustration } from "domain/illustration";
import { generateTitle } from "utils/url";

@Component({
  components: {
    FulltextSearch,
    IllustSearch
  },
  template: require("./top.html")
})
export default class Top extends Vue {
  serviceName: string = Config.SERVICE_NAME;
  metaInfo() {
    return {
      title: generateTitle()
    }
  }

  /*beforeMount() {}
  imageSearch(i: Illustration) {
    this.$router.push({
      name: "illustsearch",
      query: { image: [i.id] }
    });
  }
  keywordSearch(keyword: string[]) {
    this.$router.push({
      name: "fulltxtsearch",
      query: { keyword: keyword }
    });
  }*/
}
