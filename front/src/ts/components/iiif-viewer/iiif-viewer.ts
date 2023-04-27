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
import { Page } from "domain/page";
import { getPage,getAnalyzedPage,getAnalyzedKeyword } from "service/page-service";
import { iiifUrl, iiifUrlRaw } from "service/illust-utils";
import VueShortkey from 'vue-shortkey';
import { CrdPoint } from "./crd-helper";
require("./leaflet-iiif.js");
//import TinyYoloV3 from '../../3rdparty/tfjs-tiny-yolov3/index.js';
import { BuefyNamespace } from "buefy";
import * as Config from "config";
import {setTagPermission,checkTagPermission} from "utils/localstorage";
import { pushBookIdByTagName, retrieveAllTagNames, retrieveAllObjectByBookId, deleteBookIdByTagName, putTagObject } from "utils/indexedDB";

interface coordjsonContent {
  id: number,
  contenttext: string,
  xmin: number,
  ymin: number,
  xmax: number,
  ymax: number
}
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
  copy: boolean = false;
  textDisplay: boolean = false;
  leftOpen: boolean =false;
  isModalActive: boolean = false;
  isestDirection: boolean=null;
  //yolomodel:any=null;
  modelLoadingFlag:boolean=false;
  modelLoadedFlag:boolean=false;
  initialZoom:number=null;
  crdpoints:CrdPoint[];
  isCopyModalActive: Boolean = false;
  isTaggingModalActive: boolean = false
  allTagNames: string[] = []
  attachedTagNames: string[] = []
  tagAddInput: string = ""
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

  
  changeCopyMode() {
    this.copy ? this.exitCopyMode() : this.initializeCopyMode()
  }

  async changeTextDisplayMode() {
    this.copy && this.exitCopyMode()

    this.textDisplay ?
      this.exitTextDisplayMode() :
      this.initializeTextDisplayMode()
  }

  setPage(n) {
    if (!this.div) {
      this.currentPage = n;
    } else {
      this.currentPage = n * 2 - 1;
    }
  }
  /*async loadModel(){
    this.modelLoadingFlag=true;
    this.yolomodel = new TinyYoloV3();
    await this.yolomodel.load("/dl/assets/yolomodeloverall/model.json");
    this.setIIIFPage(this.currentPage);
  }
  async detachModel(){
    this.modelLoadedFlag=false;
    this.setIIIFPage(this.currentPage);
  }*/

  get downloadLink() {
    let p = this.currentPage;
    if (this.div) {
      p = Math.round(this.currentPage / 2);
    }
    return `${Config.BASE_PATH}api/book/download/${this.book.id}?page=${p}`;
  }
  get koma10array(){
    var returnobj: { page: number, url: string }[]=[];
    if(this.book){
      let totalp= this.totalPage;

      for(var cpage:number=0;cpage<=totalp;cpage+=10){
        let url=`${Config.BASE_PATH}api/book/downloadimgs/${this.book.id}/${cpage}`;
        var obj:{ page: number, url: string} ={page:cpage,url:url};
        returnobj.push(obj);
      }
      //console.log()
    }
    return returnobj;
  }
  get fulltextLink() {
    if(this.book){
      console.log("!");
      return `${Config.BASE_PATH}api/book/fulltext/${this.book.id}`;
    }
  }

  ////vueの管理外
  map: L.Map;
  mounted() {
    const leafletParam = {
      attributionControl: false,
      zoomControl: false,
      wheelDebounceTime: 200,
      wheelPxPerZoomLevel: 60,
      zoomSnap: 0.1,
      center: <any>[0, 0],
      crs: L.CRS.Simple,
      zoom: 2,
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
  
  async getInitialZoom(){
    const xhr = new XMLHttpRequest();
    xhr.open("get", this.infoUrl);
    xhr.onload = () => {
      let infojson = JSON.parse(xhr.responseText);
      var tolerance = 1.0;
      let imageSizes=infojson["sizes"];
      let mapSize=infojson["tiles"][0];
      var res = 2;
      for (var i = imageSizes.length - 1; i >= 0; i--) {
          let imageSize = imageSizes[i];
          if (imageSize.width * tolerance < mapSize.width && imageSize.height * tolerance < mapSize.height) {
              res=imageSizes.length-i;
              break;
          }
      }
      this.initialZoom=res;
    };
    xhr.send();
  }
  async setInfo(infoUrl: string) {
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
  currentKeywords: string[] = null;

  setManifest(manifestUrl: string, page?: number,keywords?:string[]) {
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
      if (keywords) {
        this.currentKeywords = keywords;
      } else {
        this.currentKeywords = [];
      }
    };
    xhr.send();
  }

  /*async predict(imageData) {
    return await this.yolomodel.detectAndBox(imageData, false);
  }*/
  /*async setthumbnail(url){
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
  }*/
  
  markerLayer: L.LayerGroup;
  point2latLng(pointx:number,pointy:number){
    return this.map.unproject([pointx,pointy],this.initialZoom);
  }
  
  async getQueryKeyword(pageid:string){
    if (this.markerLayer) {
      this.map.removeLayer(this.markerLayer);
    }
    this.markerLayer =new L.LayerGroup();
    var icon = new L.Icon.Default();
    icon.options.shadowSize = [0,0];
    
    let page= await getPage(pageid);
    let pageaz=await getAnalyzedPage(pageid);
    window.setTimeout(() => {
      if(pageaz.coordjson&&page.coordjson){
        //console.log(pageaz.coordjson);
        let jsoncoord=JSON.parse(page.coordjson);
        let jsoncoordaz=JSON.parse(pageaz.coordjson);

        for(var ii=0;ii<this.currentKeywords.length;ii++){
          let querykeyword=this.currentKeywords[ii];
          console.log(querykeyword);

          for(var i=0;i<jsoncoord.length;i++){
            // キーワードに一致している語句があるかを調べる
            let contenttext=jsoncoord[i]["contenttext"];
            let contenttextaz=jsoncoordaz[i]["contenttext"];
            let pos=contenttext.indexOf(querykeyword);
            let posaz=contenttextaz.indexOf(querykeyword);

            // あった場合
            if(pos !== -1){
              // 文字方向を調べる
              let w=jsoncoord[i]["xmax"]-jsoncoord[i]["xmin"];
              let h=jsoncoord[i]["ymax"]-jsoncoord[i]["ymin"];
              var tmpx=null,tmpy=null;
              if(w>h){
                tmpx=(jsoncoord[i]["xmax"]*pos+jsoncoord[i]["xmin"]*(contenttext.length-pos))/contenttext.length;
                tmpy=(jsoncoord[i]["ymin"]+jsoncoord[i]["ymax"])/2;
                icon.options.iconSize=[16,28];
                icon.options.iconAnchor=[8,28];
                icon.options.iconUrl="marker-icon.png";
                icon.options.iconRetinaUrl="marker-icon.png";
              }else{
                tmpx=(jsoncoord[i]["xmin"]+jsoncoord[i]["xmax"])/2;
                tmpy=(jsoncoord[i]["ymax"]*pos+jsoncoord[i]["ymin"]*(contenttext.length-pos))/contenttext.length;
                icon.options.iconSize=[28,16];
                icon.options.iconAnchor=[0,8];
                icon.options.iconUrl="marker-icon-yoko.png";
                icon.options.iconRetinaUrl="marker-icon-yoko.png";
              }
              let point: CrdPoint = {
                  x:tmpx,
                  y:tmpy,
                  contenttext:contenttext.replace(querykeyword,"<span style='background:yellow'>"+querykeyword+"</span>"),
                  id:jsoncoord[i]["id"]
              };
              let marker = L.marker(this.point2latLng(point.x, point.y), {icon : icon});
              marker.bindTooltip(point.contenttext);
              marker.on("click", () => {
                this.$emit("click-point", { id: point.id, i });
              });
              marker.addTo(this.markerLayer);
            }else if(posaz !== -1){
              let w=jsoncoord[i]["xmax"]-jsoncoord[i]["xmin"];
              let h=jsoncoord[i]["ymax"]-jsoncoord[i]["ymin"];
              var tmpx=null,tmpy=null;
              if(w>h){
                tmpx=(jsoncoord[i]["xmax"]*posaz+jsoncoord[i]["xmin"]*(contenttext.length-posaz))/contenttext.length;
                tmpy=(jsoncoord[i]["ymin"]+jsoncoord[i]["ymax"])/2;
                icon.options.iconSize=[16,28];
                icon.options.iconAnchor=[8,28];
                icon.options.iconUrl="marker-icon.png";
                icon.options.iconRetinaUrl="marker-icon.png";
              }else{
                tmpx=(jsoncoord[i]["xmin"]+jsoncoord[i]["xmax"])/2;
                tmpy=(jsoncoord[i]["ymax"]*posaz+jsoncoord[i]["ymin"]*(contenttext.length-posaz))/contenttext.length;
                icon.options.iconSize=[28,16];
                icon.options.iconAnchor=[0,8];
                icon.options.iconUrl="marker-icon-yoko.png";
                icon.options.iconRetinaUrl="marker-icon-yoko.png";
              }
              let point: CrdPoint = {
                  x:tmpx,
                  y:tmpy,
                  contenttext:contenttext.replace(querykeyword,"<span style='background:yellow'>"+querykeyword+"</span>"),
                  id:jsoncoord[i]["id"]
              };
              let marker = L.marker(this.point2latLng(point.x, point.y), {icon : icon});
              marker.bindTooltip(point.contenttext);
              marker.on("click", () => {
                this.$emit("click-point", { id: point.id, i });
              });
              marker.addTo(this.markerLayer);
            }
          }
        }
        this.markerLayer.addTo(this.map);
      }
    },250);
    
  }
  async setIIIFPage(n: number) {
    if (this.manifest && n > 0) {
      const infoUrl =
        this.manifest.sequences[0].canvases[n - 1].images[0].resource.service[
          "@id"
        ] + "/info.json";//https://www.dl.ndl.go.jp/api/iiif/1235428/R0000025/info.json
      //const thumbUrl =
      //  this.manifest.sequences[0].canvases[n - 1].thumbnail["@id"];
        //https://www.dl.ndl.go.jp/api/iiif/1235428/F0000025/full/full/0/default.jpg
      //if(this.modelLoadingFlag||this.modelLoadedFlag)this.setthumbnail(thumbUrl);
      this.setInfo(infoUrl).then(()=>{this.getInitialZoom()});
      this.$nextTick(() => {
        this.getQueryKeyword(this.book.id + "_" + n);
      });
      //.then(()=>{this.watchPoints()});
      this.setLR();
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
    if (this.currentPage < this.totalPage){
      this.currentPage++;
      var queryobj = Object.assign({}, this.$route.query);
      queryobj["page"]=String(this.currentPage);
      this.$router.replace({ query: queryobj});
    }
  }

  public previous() {
    if (this.currentPage > 1){
      this.currentPage--;
      var queryobj = Object.assign({}, this.$route.query);
      queryobj["page"]=String(this.currentPage);
      this.$router.replace({ query: queryobj});
    }
  }

  @Watch("currentPage")
  watchPage(n) {
    this.inputPageModel = n;
    this.exitCopyMode()
    this.exitTextDisplayMode()
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

  // テキストコピー
  mousedownLatLng: L.LatLng;
  mouseupLatLng: L.LatLng;
  selectedAreaRectangle: L.Rectangle;
  textAreaRectangles: L.Rectangle[] = [];
  coordjson: {
    pageId: string
    data: coordjsonContent[]
  } = {
    pageId: "",
    data: []
  };
  isAreaSelecting: Boolean = false;
  mouseupedInOutside: Boolean = false;
  selectedCoordinates: {
    minX: number,
    minY: number,
    maxX: number,
    maxY: number
  } = { 
    minX: 0,
    minY: 0,
    maxX: 0,
    maxY: 0
  };
  shouldInsertSpace: Boolean = false
  shouldDivideByCenter: Boolean = false
  centerAxisX: number;
  shouldIgnoreRuby: Boolean = false;
  rubySize: number = 0;

  // テキストコピーの設定系
  async initializeCopyMode() {
    this.copy = true
    this.exitTextDisplayMode()
    this.fitBounds()

    const page = await getPage(this.pageId);

    await this.fetchCoordjson(this.pageId)
    
    // map内のbounds stateが更新されるのにラグがあるため待つ
    setTimeout(() => {
      const mapBounds = this.map.getBounds()
      
      const minX = this.latLng2Point(mapBounds.getNorthWest()).x
      const maxX = this.latLng2Point(mapBounds.getSouthEast()).x
      this.centerAxisX =  minX + (maxX - minX) * page.divide

      this.setSelectedCoordinates(mapBounds.getNorthEast(), mapBounds.getSouthWest())
      
      this.displaySelectedTextModal()
    }, 300)

  }

  async initializeSelectMode() {
    this.exitSelectMode()
    this.isCopyModalActive = false
    this.map.dragging.disable()
    this.map.on('mousedown', this.mousedownHandler)
    this.map.on("mousemove", this.mousemoveHandler)
    this.map.on("mouseup", this.mouseupHandler)

    const coordjson: coordjsonContent[] = await this.fetchCoordjson(this.pageId)

    this.drawRectangleOnTextArea(coordjson)
  }

  async initializeTextDisplayMode() {
    this.textDisplay = true
    const coordjson: coordjsonContent[] = await this.fetchCoordjson(this.pageId)
    this.drawRectangleOnTextArea(coordjson, { clickToCopy: true, color: "#ff3300" })
  }

  exitCopyMode() {
    this.copy = false
    this.isCopyModalActive = false
    this.exitSelectMode()
  }

  exitSelectMode() {
    if(this.selectedAreaRectangle) this.selectedAreaRectangle.remove()
    this.map.dragging.enable()
    this.map.off('mousedown', this.mousedownHandler)
    this.map.off("mousemove", this.mousemoveHandler)
    this.map.off("mouseup", this.mouseupHandler)
    this.map.off("mouseout", this.mouseoutHandler)
    this.map.off("mouseover", this.mouseoverHandler)
    
    this.cleanUpTextAreaRectangles()
  }

  exitTextDisplayMode() {
    this.cleanUpTextAreaRectangles()
    this.textDisplay = false
  }

  // テキストコピーのmouseevent系
  mousedownHandler(e: L.LeafletMouseEvent) {
    if(this.mouseupedInOutside) {
      this.mouseupedInOutside = false
      return
    }

    this.map.on("mouseout", this.mouseoutHandler)

    this.mousedownLatLng = e.latlng
    this.isAreaSelecting = true
  }
  mousemoveHandler(e: L.LeafletMouseEvent) {
    if(!this.isAreaSelecting) return

    this.mouseupLatLng = e.latlng
    this.drawRectangleOnSelectedArea(this.mousedownLatLng, this.mouseupLatLng)
  }
  mouseoutHandler(_e: L.LeafletMouseEvent) {
    this.map.on("mouseover", this.mouseoverHandler)
  }
  mouseoverHandler(e: L.LeafletMouseEvent) {
    // 範囲外でmouseupしていた場合、次のクリックで範囲確定の処理をする
    if(e.originalEvent.button === 0) this.mouseupedInOutside = true
    this.map.off("mouseover", this.mouseoverHandler)
  }
  async mouseupHandler(e: L.LeafletMouseEvent) {
    if(!this.isAreaSelecting) return

    // 範囲外でmouseupしてしまった場合に直感的な操作になるように
    this.map.off("mouseout", this.mouseoutHandler)
    this.map.off("mouseover", this.mouseoverHandler)

    this.mouseupLatLng = e.latlng
    this.drawRectangleOnSelectedArea(this.mousedownLatLng, this.mouseupLatLng)
    this.isAreaSelecting = false

    await this.fetchCoordjson(this.pageId)

    this.setSelectedCoordinates(this.mousedownLatLng, this.mouseupLatLng)
    this.displaySelectedTextModal()
  }

  // テキストコピーのleaflet操作系
  drawRectangleOnSelectedArea(startPoint: L.LatLng, endPoint: L.LatLng) {
    if(this.selectedAreaRectangle) this.selectedAreaRectangle.remove()

    this.selectedAreaRectangle = L.rectangle([
      [startPoint.lat,startPoint.lng], [endPoint.lat, endPoint.lng]
    ], {color: "#ff7800", weight: 1}).addTo(this.map)
  }
  latLng2Point(latLng: L.LatLng){
    return this.map.project(latLng,this.initialZoom);
  }

  cleanUpTextAreaRectangles() {
    this.textAreaRectangles
      .map((rectangle) => rectangle.remove())
      .splice(0)
  }

  drawRectangleOnTextArea(
    coordjson: coordjsonContent[],
    { clickToCopy = false, color = "#0080ff" } : 
    { clickToCopy?: boolean, color?: string } = {}
  ) {
    this.textAreaRectangles = coordjson.map((
      { xmax, xmin, ymax, ymin, contenttext }
    ) => {
      const startLatLng = this.point2latLng(xmin, ymin)
      const endLatLng = this.point2latLng(xmax,ymax)
      const rectAngles = L.rectangle(
        [
          [startLatLng.lat, startLatLng.lng],
          [endLatLng.lat, endLatLng.lng]
        ],
        { color }
      ).bindTooltip(contenttext)

      if (clickToCopy === true) {
        rectAngles.on("click", (_e) => {
          this.copySelectedText(contenttext)
        })
      }
      return rectAngles.addTo(this.map)
    })
  }

  @Watch("rubySize")
  onrubySize(_n) {
    this.cleanUpTextAreaRectangles()

    const targetTextCoordjson = this.shouldIgnoreRuby ? this.coordjson.data.filter(({xmax, xmin, ymax, ymin}) => {
      return (xmax - xmin) * (ymax - ymin) > this.rubySize * 100
    }) : this.coordjson.data
    this.drawRectangleOnTextArea(targetTextCoordjson)
  }

  // テキストコピーのutil系
  setSelectedCoordinates(apexLatLngA: L.LatLng, apexLatLngB: L.LatLng) {
    const apexCoordinatesA = this.latLng2Point(apexLatLngA)
    const apexCoordinatesB = this.latLng2Point(apexLatLngB)

    if(apexCoordinatesA.x > apexCoordinatesB.x) {
      [this.selectedCoordinates.maxX, this.selectedCoordinates.minX] 
        = [apexCoordinatesA.x, apexCoordinatesB.x]
    } else {
      [this.selectedCoordinates.maxX, this.selectedCoordinates.minX]
        = [apexCoordinatesB.x, apexCoordinatesA.x]
    }
    if(apexCoordinatesA.y > apexCoordinatesB.y) {
      [this.selectedCoordinates.maxY, this.selectedCoordinates.minY]
        = [apexCoordinatesA.y, apexCoordinatesB.y]
    } else {
      [this.selectedCoordinates.maxY, this.selectedCoordinates.minY]
        = [apexCoordinatesB.y, apexCoordinatesA.y]
    }
  }

  async fetchCoordjson(pageId: string): Promise<coordjsonContent[]> {
    if(pageId === this.coordjson.pageId) return this.coordjson.data
    this.coordjson.data = JSON.parse(
      (await getPage(pageId)).coordjson
    );
    this.coordjson.pageId = pageId

    return this.coordjson.data
  }

  copySelectedText(targetText: string) {
    this.$copyText(targetText)
      .then(() => {
        this.$buefy.notification.open({
          message: `コピーしました（${targetText.slice(0, 6)}${targetText.length > 6 ? "..." : ""}）`,
        })
      })
      .catch(() => {
        this.$buefy.notification.open({
          message: `コピーに失敗しました（${targetText.slice(0, 6)}${targetText.length > 6 ? "..." : ""}）`,
          queue: false,
          type: 'is-danger'
        })
      })
  }

  displaySelectedTextModal() {
    if(this.textInSelectedArea !== "") this.isCopyModalActive = true
    else this.$buefy.notification.open({
      message: "文字列を取得できませんでした",
      queue: false,
    })
  }

  get pageId() {
    return this.book.id + "_" + this.currentPage
  }

  escapeHTML(string: string) {
    if(typeof string !== 'string') {
      return string;
    }
    return string.replace(/[&'`"<>]/g, (match) => {
      return {
        '&': '&amp;',
        "'": '&#x27;',
        '`': '&#x60;',
        '"': '&quot;',
        '<': '&lt;',
        '>': '&gt;',
      }[match]
    });
  }

  get textInSelectedArea():string {
    let coordjsonData = this.coordjson.data

    if(this.shouldDivideByCenter) {
      const leftPageData: coordjsonContent[] = []
      const rightPageData: coordjsonContent[] = []
      coordjsonData.forEach((data) => {
        if(data.xmax < this.centerAxisX) leftPageData.push(data)
        else rightPageData.push(data)
      })
      coordjsonData = leftPageData.concat(rightPageData)
    }

    if(this.shouldIgnoreRuby) {
      coordjsonData = coordjsonData.filter(({xmax, xmin, ymax, ymin}) => {
        return (xmax - xmin) * (ymax - ymin) > this.rubySize * 100
      })
    }

    let textInSelectedArea = coordjsonData.filter(({xmin, ymin, xmax, ymax}) => {
      const isTextInSelectedArea = this.selectedCoordinates.maxX > xmax
                && this.selectedCoordinates.maxY > ymax
                && this.selectedCoordinates.minX < xmin
                && this.selectedCoordinates.minY < ymin

      return isTextInSelectedArea
    }).map(({contenttext}) => this.shouldInsertSpace ? `${contenttext} ` : contenttext).join("")

    // v-htmlを使ってるので一応エスケープしとく
    textInSelectedArea = this.escapeHTML(textInSelectedArea)


    if(this.currentKeywords !== null) {
      const keywordsInText = this.currentKeywords.filter((keyword) => textInSelectedArea.indexOf(keyword) !== -1)
      const keywordsRegExp = new RegExp(`(${keywordsInText.join("|")})`,"g")
      textInSelectedArea = textInSelectedArea.replace(keywordsRegExp, "<em style='background-color: #f5b12e;'>$1</em>")
    }

    return textInSelectedArea
  }

  // tags
  get unattacedTags(): string[] {
    return this.allTagNames.filter(tagName => this.attachedTagNames.includes(tagName) === false)
  }

  async tagButtonHandler() {
    this.isTaggingModalActive = true
    if(!checkTagPermission()){
      const confirmed = confirm(
        this.$l2(
          "タグ情報はWebブラウザのIndexedDBに保存されます。共有PC等では、他の利用者にも履歴が表示されますので、その点をご理解のうえご使用ください。",
          "This function is saved in the IndexedDB of the Web browser. Please understand that the history will be displayed to other users on shared PCs, and so on."
        )
      );
      if (confirmed === false){
        this.$router.go(0);
        return;
      }else{
        setTagPermission();
      }
    }
    this.allTagNames = await retrieveAllTagNames()
    this.attachedTagNames = (await retrieveAllObjectByBookId(this.book.id))
                              .map(tag => tag.tagName)
  }

  async tagClickedHandler(tagName: string) {
    // すでにタグがついている場合は、削除処理をする
    if(this.attachedTagNames.includes(tagName)) {
      await deleteBookIdByTagName({
        bookId: this.book.id,
        tagName: tagName
      })
    }
    // タグがついていない場合は、追加処理をする
    else {
      await pushBookIdByTagName({
        bookId: this.book.id,
        tagName: tagName
      })
    }

    this.attachedTagNames = (await retrieveAllObjectByBookId(this.book.id))
                              .map(tag => tag.tagName)
    this.allTagNames = await retrieveAllTagNames()
  }

  async tagAddHandler(_e: PointerEvent) {
    const tagName = this.tagAddInput
    // 他のタブで追加しているかもしれないので、一応最新のものをもってくる
    const allTagNames = await retrieveAllTagNames()
    // すでに存在するタグだったらpushするだけ
    if(allTagNames.includes(tagName)) {
      await pushBookIdByTagName({
        bookId: this.book.id,
        tagName: tagName
      })
    } else {
      // 初めてのタグだったら初期化する
      await putTagObject({
        tagName,
        bookIds: [this.book.id]
      })
    }
    
    this.tagAddInput = ""
    this.allTagNames = await retrieveAllTagNames()
    this.attachedTagNames = (await retrieveAllObjectByBookId(this.book.id))
                              .map(tag => tag.tagName)
  }

  get filteredTagNameArray() {
    return this.allTagNames.filter((option) => {
      return option
          .toString()
          .toLowerCase()
          .indexOf(this.tagAddInput.toLowerCase()) >= 0
  })
  }
}
