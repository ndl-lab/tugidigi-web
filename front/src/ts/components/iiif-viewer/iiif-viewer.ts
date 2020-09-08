import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { debounce } from "throttle-debounce";
import { MyVue } from "types";
import Vue from "vue";
import Component from "vue-class-component";
import VueSlider from 'vue-slider-component';
import { Watch, Prop } from "vue-property-decorator";
import "./iiif-viewer.scss";
import { Book } from "domain/book";
import { getPage } from "service/page-service";
import { iiifUrl, iiifUrlRaw } from "service/illust-utils";
import VueShortkey from 'vue-shortkey';
require("./leaflet-iiif.js");
import TinyYoloV3 from '../../3rdparty/tfjs-tiny-yolov3/index.js';

export default interface IiifViewer extends MyVue {}

@Component({
  template: require("./iiif-viewer.html"),
  components: {
    VueSlider
  }
})
export default class IiifViewer extends Vue {
  full: boolean = false;
  div: boolean = false;
  leftOpen: boolean =false;
  isModalActive: boolean = false;
  isestDirection: boolean=null;
  yolomodel:any=null;
  modelLoadingFlag:boolean=false;
  modelLoadedFlag:boolean=false;
  
  @Prop()
  book: Book;
  changeFull() {
    this.full = !this.full;
    if (this.full) {
      this.$disableScroll();
    } else {
      this.$enableScroll();
    }
    this.$nextTick(() => {
      this.map.invalidateSize();
      this.fitBounds();
    });
  }
  changeLR(){
    this.leftOpen=! this.leftOpen;
    this.isestDirection=false;
  }

  changeDiv() {
    this.div = !this.div;
    if (!this.div) {
      this.currentPage = Math.round(this.currentPage / 2);
      this.setIIIFPage(this.currentPage);
    } else {
      this.currentPage = this.currentPage * 2 - 1;
      this.setDivPage(this.currentPage);
    }
  }

  setPage(n) {
    if (!this.div) {
      this.currentPage = n;
    } else {
      this.currentPage = n * 2 - 1;
    }
  }
  async loadModel(){
    this.modelLoadingFlag=true;
    this.yolomodel = new TinyYoloV3();
    await this.yolomodel.load("/dl/assets/yolomodeloverall/model.json");
    this.setIIIFPage(this.currentPage);
  }
  async detachModel(){
    this.modelLoadedFlag=false;
    this.setIIIFPage(this.currentPage);
  }

  get downloadLink() {
    let p = this.currentPage;
    if (this.div) {
      p = Math.round(this.currentPage / 2);
    }
    return `/dl/api/book/download/${this.book.id}?page=${p}`;
  }

  ////vueの管理外
  map: L.Map;

  mounted() {
    const leafletParam = {
      attributionControl: false,
      zoomControl: false,
      wheelDebounceTime: 200,
      wheelPxPerZoomLevel: 20,
      zoomSnap: 0.1,
      center: <any>[0, 0],
      crs: L.CRS.Simple,
      zoom: 0
    };
    //this.loadModel();
    this.map = L.map(<HTMLElement>this.$refs["leaflet"], leafletParam);

    //EscでFull Screenをやめる
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        if (this.full) this.changeFull();
      }
    });
  }

  fitBounds() {
    if (!this.div) {
      this.iiifLayer._fitBounds();
    } else {
      this.map.fitBounds(this.bounds, { animate: true });
    }
  }

  clear() {
    if (this.map) {
      this.map.eachLayer(l => {
        this.map.removeLayer(l);
      });
    }
  }

  /////////////分割ページ////////////////

  bounds: L.LatLngBounds;
  overlay: L.ImageOverlay;

  setUrl(src: string) {
    this.clear();
    if (this.map) {
      this.map.setMaxZoom(6);
      this.map.setMinZoom(1);
      const img: HTMLImageElement = new Image();
      img.onload = () => {
        window.setTimeout(() => {
          var southWest = this.map.unproject(
            [0, img.height],
            this.map.getMaxZoom() - 1
          );
          var northEast = this.map.unproject(
            [img.width, 0],
            this.map.getMaxZoom() - 1
          );
          this.bounds = new L.LatLngBounds(southWest, northEast);
          this.overlay = L.imageOverlay(src, this.bounds);
          this.overlay.addTo(this.map);

          this.map.fitBounds(this.bounds, {
            animate: false
          });
        }, 250);
      };
      img.src = src;
    }
  }
  async setLR(){
    if(this.isestDirection===null&&this.book.leftopen!==null){
      this.leftOpen=this.book.leftopen;
      this.isestDirection=true;
    }
  }
  async setDivPage(i: number) {
    let page = await getPage(this.book.id + "_" + Math.round(i / 2));

    let height = (<Element>this.$refs["leaflet"]).clientHeight * 2;

    if (i % 2 === 0) {
      //奇数ページ
      this.setUrl(
        iiifUrlRaw(
          page.book,
          page.page,
          page.rectX,
          page.rectY,
          page.divide * 100 - page.rectX,
          page.rectH,
          height
        )
      );
    } else {
      //偶数ページ
      this.setUrl(
        iiifUrlRaw(
          page.book,
          page.page,
          page.divide * 100,
          page.rectY,
          page.rectX + page.rectW - page.divide * 100,
          page.rectH,
          height
        )
      );
    }
  }

  //////////////////IIIF///////////////

  iiifLayer: any;
  ///Info

  infoUrl: string = "";
  setInfo(infoUrl: string) {
    this.clear();
    if (this.map) {
      this.map.setMaxZoom(Number.POSITIVE_INFINITY);
      this.map.setMinZoom(0);
      this.iiifLayer = (<any>L.tileLayer).iiif(infoUrl, {});
      this.map.addLayer(this.iiifLayer);
      this.infoUrl = infoUrl;
    }
  }

  getInfo() {
    return this.infoUrl;
  }
  

  ///Manifest

  manifest: any = null;
  currentPage: number = null;

  setManifest(manifestUrl: string, page?: number) {
    const xhr = new XMLHttpRequest();
    xhr.open("get", manifestUrl);
    xhr.onload = () => {
      let manifest = JSON.parse(xhr.responseText);
      this.manifest = manifest;
      if (page) {
        this.currentPage = page;
      } else {
        this.currentPage = 1;
      }
    };
    xhr.send();
  }
  async predict(imageData) {
    return await this.yolomodel.detectAndBox(imageData, false);
  }
  async setthumbnail(url){
    const image:any = new Image();
    image.src = url;
    image.height=320;
    image.width=320;
    image.crossOrigin = 'anonymous';
    let height = (<Element>this.$refs["leaflet"]).clientHeight * 2;
    image.onload = () => {
      this.predict(image).then((values)=>{
        if(values.length>0&&values[0]["width"]*values[0]["height"]>=320*320*0.1){
          this.setUrl(
          iiifUrlRaw(
            this.book.id,
            this.currentPage,
            values[0]["left"]/320*100.0,
            values[0]["top"]/320*100.0,
            values[0]["width"]/320*100.0,
            values[0]["height"]/320*100.0,
            height
          ));
        }
        this.modelLoadingFlag=false;
        this.modelLoadedFlag=true;
      });
    };
  }
  setIIIFPage(n: number) {
    if (this.manifest && n > 0) {
      const infoUrl =
        this.manifest.sequences[0].canvases[n - 1].images[0].resource.service[
          "@id"
        ] + "/info.json";//https://www.dl.ndl.go.jp/api/iiif/1235428/R0000025/info.json
      const thumbUrl =
        this.manifest.sequences[0].canvases[n - 1].thumbnail["@id"];
        //https://www.dl.ndl.go.jp/api/iiif/1235428/F0000025/full/full/0/default.jpg
      if(this.modelLoadingFlag||this.modelLoadedFlag)this.setthumbnail(thumbUrl);
      this.setInfo(infoUrl);
      this.setLR();
      console.log(this.leftOpen);
    }
  }

  ////////////PageControl//////////////////

  get totalPage() {
    if (this.manifest) {
      let size = this.manifest.sequences[0].canvases.length;
      if (this.div) return size * 2;
      else return size;
    }
    return 0;
  }

  inputPageModel = 0;
  inputPage(e) {
    debounce(1000, () => {
      if (this.inputPageModel == null) this.currentPage = 1;
      else if (this.inputPageModel < 1) this.currentPage = 1;
      else if (this.inputPageModel > this.totalPage)
        this.currentPage = this.totalPage;
      else this.currentPage = this.inputPageModel;
      this.inputPageModel = this.currentPage;
    })();
  }

  public next() {
    if (this.currentPage < this.totalPage) this.currentPage++;
  }

  public previous() {
    if (this.currentPage > 1) this.currentPage--;
  }

  @Watch("currentPage")
  watchPage(n) {
    this.inputPageModel = n;
    if (!this.div) this.setIIIFPage(this.currentPage);
    else this.setDivPage(this.currentPage);
  }
  
  //コントラスト調整
  table: string = "0 0.1 1";
  colors: string = `0 1 0 0 0
                    0 1 0 0 0
                    0 1 0 0 0
                    0 1 0 1 0`;
  bwflag: boolean = false;
  menuflag: boolean = true;
  
  th: number = 161;
  showThParam: boolean = false;
  changethparam(){
      if(this.book.contrastparam)this.th=this.book.contrastparam;
      console.log("contrast param:"+this.th);
  }
  
  get filterParams() {
      let param: string = "";
      let a = 10;
      for (let r = 0; r < 256; r++) {
          if (r !== 0) param += " ";
          param += (1.0 / (1.0 + Math.exp(-a * (r - this.th) / 255)));
      }
      return param;
  }
  showTh(){
      this.showThParam = !this.showThParam;
      this.thSliderOption.show = this.showThParam;
  }
  thSliderOption: any = {
      show :false,
      min: 0,
      max: 255,
      interval: 0.1,
      //tooltip: 'hover',
      bgStyle: {
          "backgroundColor": "#ddd"
      },
      tooltipStyle: {
          "backgroundColor": "#53B332",
          "borderColor": "#53B332"
      },
      processStyle: {
          "backgroundColor": "#53B332"
      }
  }

}
