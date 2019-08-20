import Buefy from "buefy";
import Footer from "components/footer/footer";
import Header from "components/header/header";
import Book from "pages/book/book";
import SearchPage from "pages/search/search";
import Top from "pages/top/top";
import "swiper/dist/css/swiper.css";
import "tslib";
import Vue from "vue";
import VueAwesomeSwiper from "vue-awesome-swiper";
import VueMasonry from "vue-masonry-css";
import VueRouter from "vue-router";
import "./styles/main.scss";

require("utils/polyfills");

if (process.env.NODE_ENV !== "production") {
  Vue.config.devtools = true;
  Vue.config.performance = true;
}

Vue.use(Buefy);

Vue.use(VueMasonry);

Vue.use(VueAwesomeSwiper);

require("types");

Vue.use(VueRouter);

//
let router: VueRouter = new VueRouter({
  mode: "history",
  base: "/dl/",
  scrollBehavior: (to, from, savedPosition: { x: number; y: number }) => {
    if (savedPosition) {
      return savedPosition;
    } else {
      // new navigation.
      let position = { x: undefined, y: undefined, selector: undefined };
      // scroll to anchor by returning the selector
      if (to.hash) {
        position.selector = to.hash;
      }
      if (to.name !== from.name) {
        position.x = 0;
        position.y = 0;
      }
      return position;
    }
  },
  routes: [
    { path: "/", name: "top", component: Top, meta: { scrollToTop: true } },
    { path: "/search", name: "search", component: SearchPage },
    { path: "/book/:id", name: "book", component: Book },
    { path: "*", redirect: { name: "top" } }
  ]
});

new Vue({
  template: require("main.html"),
  router: router,
  components: {
    apheader: Header,
    apfooter: Footer
  }
}).$mount("#app");
