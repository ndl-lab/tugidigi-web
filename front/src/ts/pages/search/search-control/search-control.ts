import { Illustration } from "domain/illustration";
import {
  getDefaultIllustrations,
  getRandomIllustrations
} from "service/illust-service";
import { SearchResult } from "service/search-utils";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import IllustImage from "../illust-image/illust-image";
import "./search-control.scss";

@Component({
  template: require("./search-control.html"),
  components: {
    IllustImage
  }
})
export default class SearchControl extends Vue {
  activeTab: number = 0;

  @Prop({ default: "" })
  keyword: string;

  @Prop()
  qillust: Illustration;

  @Watch("qillust")
  watchForTab() {
    if (this.qillust != null) this.activeTab = 1;
  }

  illusts: Illustration[] = [];

  swiperOption: any = {
    slidesPerView: 5,
    spaceBetween: 30,
    freeMode: true,
    grabCursor: true,
    preventClicks: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    breakpoints: {
      768: {
        slidesPerView: 1,
        spaceBetween: 10
      }
    }
  };

  async beforeMount() {
    this.illusts = (await getDefaultIllustrations()).data;
  }

  async reloadImage() {
    if (this.qillust) {
      this.qillust = null;
      this.illusts = (await getDefaultIllustrations()).data;
    } else {
      this.illusts = (await getRandomIllustrations()).data;
    }
  }

  imageSearch(i: Illustration) {
    this.$emit("image-search", i);
  }
  keywordSearch() {
    this.$emit("keyword-search", this.keyword.split(/[\s　]+/));
  }
}
