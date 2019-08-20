import * as Config from "config";
import SearchControl from "pages/search/search-control/search-control";
import Vue from "vue";
import Component from "vue-class-component";
import "./top.scss";
import { Illustration } from "domain/illustration";

@Component({
  components: {
    SearchControl
  },
  template: require("./top.html")
})
export default class Top extends Vue {
  serviceName: string = Config.SERVICE_NAME;

  beforeMount() {}
  imageSearch(i: Illustration) {
    this.$router.push({
      name: "search",
      query: { image: [i.id] }
    });
  }
  keywordSearch(keyword: string[]) {
    this.$router.push({
      name: "search",
      query: { keyword: keyword }
    });
  }
}
