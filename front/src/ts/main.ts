import Buefy from "buefy";
import Footer from "components/footer/footer";
import Header from "components/header/header";
import Book from "pages/book/book";
//import SearchPage from "pages/search/search";
import Top from "pages/top/top";
import FulltextSearch from "pages/search/fulltext-search/search-ui/fulltext-search";
import IllustSearch from "pages/search/illust-search/search-ui/illust-search";
import FullTextSearchResultsPage from "pages/search/fulltext-search/results-ui/fulltext-results";
import IllustSearchResultsPage from "pages/search/illust-search/results-ui/illust-results";
import Mypage from "pages/mypage/mypage"
import "swiper/dist/css/swiper.css";
import "tslib";
import Vue from "vue";
import VueAwesomeSwiper from "vue-awesome-swiper";
import VueMasonry from "vue-masonry-css";
import VueRouter from "vue-router";
import VueKonva from 'vue-konva';
import VueShortkey from 'vue-shortkey';

import VueClipboard from 'vue-clipboard2'
import VueMeta from 'vue-meta'
import VueHead from 'vue-head'

import "./styles/main.scss";
import * as Config from "config";

require("utils/polyfills");

/*if (process.env.NODE_ENV !== "production") {
  Vue.config.devtools = true;
  Vue.config.performance = true;
}*/

Vue.use(VueShortkey);
Vue.use(VueClipboard)
Vue.use(Buefy);
Vue.use(VueHead);


Vue.use(VueMasonry);

Vue.use(VueAwesomeSwiper);

require("types");

Vue.use(VueRouter);
Vue.use(VueMeta)

Vue.use(VueKonva);

//
let router: VueRouter = new VueRouter({
  mode: "history",
  base: Config.BASE_PATH,
  scrollBehavior: (to, from, savedPosition: { x: number; y: number }) => {
    if (savedPosition) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(savedPosition)
        })
      });
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
    { path: "/fulltext", name: "fulltextsearch", component: FulltextSearch, meta: { scrollToTop: true } },
    { path: "/illust", name: "illustsearch", component: IllustSearch, meta: { scrollToTop: true } },
//    { path: "/fulltext/search", name: "fulltextsearchres", component: FullTextSearchResultsPage },
    { path: "/illust/search", name: "illustsearchres", component: IllustSearchResultsPage },
    //{ path: "/search", name: "search", component: SearchPage },
    { path: "/book/:id", name: "book", component: Book },
    { path: "/mypage", name: "mypage", component: Mypage },
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
