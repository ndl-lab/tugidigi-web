import Vue from "vue";
import Component from "vue-class-component";
import SearchStore from "components/search/search-store/search-store";

import "./search-pagination.scss";
import { Prop } from "vue-property-decorator";

@Component({
  name: "SearchPagination",
  template: require("./search-pagination.html")
})
export default class SearchPagination extends Vue {
  @Prop({ default: 2 })
  size: number;
  @Prop()
  ss: SearchStore<any>;

  handleScroll() {
    var scrollGrid = document.getElementsByClassName("grid").item(0);
    if (scrollGrid != null) {
      window.addEventListener("scroll", () => {});
    }
  }

  goto(page) {
    if (page < 0) page = 0;
    if (page > this.maxPage) page = this.maxPage;
    this.ss.setFrom(this.ss.size * (page - 1));
  }

  get page() {
    return Math.floor(this.ss.from / this.ss.size) + 1;
  }

  get show1() {
    return this.page - this.size > 1;
  }

  get show2() {
    return this.page < this.maxPage - this.size && this.maxPage < 20;
  }

  get pageArray() {
    let arr = [];
    for (let i = this.page - this.size; i < this.page + this.size + 1; i++) {
      if (i > 0 && i <= this.maxPage) arr.push(i);
    }
    return arr;
  }

  get maxPage() {
    return Math.ceil(this.ss.hit / this.ss.size);
  }
}
