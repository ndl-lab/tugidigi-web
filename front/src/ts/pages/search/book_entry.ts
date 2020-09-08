import { Book } from "domain/book";
import { Illustration } from "domain/illustration";
import { iiifUrlWithHeight } from "service/illust-utils";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import "./book-entry.scss";
import IllustImage from "./illust-image/illust-image";

@Component({
  template: require("./book_entry.html"),
  components: { IllustImage }
})
export default class BookEntry extends Vue {
  @Prop()
  book: Book;

  @Prop()
  keywords: string[];

  thumbError: boolean = false;

  swiperOption: any = {
    slidesPerView: 5,
    spaceBetween: 10,
    freeMode: true,
    preventClicks: false,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    breakpoints: {
      1200: {
        slidesPerView: 3,
        spaceBetween: 10
      },
      800: {
        slidesPerView: 1,
        spaceBetween: 10
      }
    }
  };

  search(i) {
    this.$emit("search", i);
  }

  imgurl(i: Illustration) {
    return iiifUrlWithHeight(i, 128);
  }

  get thubmUrl() {
    return `https://www.dl.ndl.go.jp/api/iiif/${
        this.book.id
      }/R0000001/full/256,/0/default.jpg`;
    /*if (this.thumbError)
      return `https://www.dl.ndl.go.jp/api/iiif/${
        this.book.id
      }/R0000001/full/256,/0/default.jpg`;
    return "https://dl.ndl.go.jp/titleThumb/info:ndljp/pid/" + this.book.id;*/
  }
  show(i: Illustration) {
    let routeData = this.$router.resolve({
        name: "book",
      params: { id: i.pid },
      query: { page: String(i.page) }
    });
    window.open(routeData.href, '_blank');
  }
}
