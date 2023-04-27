// Vue とかより先に読み込む必要がある
import Component from "vue-class-component";
Component.registerHooks([
  'metaInfo'
])


import RectEditor from "components/rect-editor/edit";
import { Illustration } from "domain/illustration";
import SearchSort from "components/search/search-sort/search-sort";
import SearchStore from "components/search/search-store/search-store";
import SearchFacet from "components/search/search-facet/search-facet";
import SearchPagesize from "components/search/search-pagesize/search-pagesize";
import SearchPagination from "components/search/search-pagination/search-pagination";

import {
  getDefaultIllustrations,
  getRandomIllustrations,
  getRandomIllustrationsWithFacet,
  putImageFeature,
  putTextFeature,
  getIllustrationsByBook,
  getIllustration,
  getIllustrations
} from "service/illust-service";
import {
  getLsCache,
  LsCacheConfig,
  putLsCache
} from "service/local-storage-cache-service";

import { Book } from "domain/book";
import { searchmetaBook } from "service/book-service";
import { SearchResult } from "service/search-utils";
import Vue from "vue";
//import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import IllustImage from "../../illust-image/illust-image";
import SketchCanvas from "../../sketch-canvas/sketch-canvas";
import BookEntry from "../../book_entry";
import "./illust-search.scss";
const IMF_FEATURE_CACHE: LsCacheConfig = { type: "imgf", maxCacheSize: 10 };
const MODEL_IMAGE_SIZE = 224;
//declare var tf: any;

import { generateTitle } from "utils/url";

@Component({
  template: require("./illust-search.html"),
  components: {
    BookEntry,
    IllustImage,
    SketchCanvas,
    SearchPagesize,
    SearchPagination,
    SearchFacet,
    SearchSort,
    RectEditor
  }
})
export default class IllustSearch extends Vue {
  activeTab: number = 0;
  ssBook: SearchStore<Book> = null;
  ssIllust: SearchStore<Illustration> = null;
  radius: number = 50;
  metasearchFlag: boolean=false;
  loadingResultsFlag: boolean=false;
  targetURL: string = "";
  urlSearchErrorMessage: string = "";
  mindist:number=0;
  croprect:{
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  }=null;
  
  @Prop()
  qillust: Illustration;
  
  @Prop({ default: "" })
  keyword: string;
  
  @Prop()
  targeturl: string;
  
  @Prop()
  keyword2vec:string;


  @Watch("activeTab")
  async watchForTab() {
    if(this.activeTab==0){
      this.illusts = (await getDefaultIllustrations()).data;
    }else{
      this.illusts = null;
    }
    this.$emit("change-tab",this.activeTab);
  }
  
  changeTab(num:number){
    this.activeTab=num;
  }

  illusts: Illustration[] = [];
  illustresarray: Illustration[] = [];
  illustURLresarray: Illustration[] = [];

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

  async reloadImage(facettype:string) {
    if (this.qillust) {
      this.qillust = null;
      //this.illusts = (await getDefaultIllustrations()).data;
    }
    this.illusts = (await getRandomIllustrationsWithFacet(facettype)).data;
  }
  imageSearch(i: Illustration) {
    this.loadingResultsFlag=true;
    this.$router.push({
      name: "illustsearchres",
      query: { image: [i.id],'fc-graphictags.tagname':i.graphictags.map(function( value ) {return value.tagname;})}
    });
    this.$router.go(0);//強制リロード
  }
  
  keywordSearch(keywords: string[]) {
    this.loadingResultsFlag=true;
    if(keywords){
      this.$router.push({
        name: "illustsearchres",
        query: { keyword: keywords }
      });
    }else{
      this.$router.push({
        name: "illustsearchres",
        query: { keyword: this.keyword }
      });
    }
    this.$router.go(0);//強制リロード
  }

  async urlSearch() {
    if(this.targeturl!= undefined){
      this.flagAnalyzing = true;
      this.urlSearchErrorMessage = "";
      this.illustURLresarray=[];
      const param  = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({'img_url': this.targeturl})
      };
      const response = await fetch("https://lab.ndl.go.jp/dl/api/imagefeatures", param)
      const { body: features } = await response.json()
      if(features === undefined) {
        this.flagAnalyzing = false;
        this.urlSearchErrorMessage = "エラーが発生しました。URLの形式を確認してください";
        return
      }

      try {
        const result = await putImageFeature(features)
        this.illustURLresarray = result.data.list;
      } catch(e) {
        this.urlSearchErrorMessage = "エラーが発生しました。時間をおいて再度お試しください";
        console.log(e)
      } finally {
        this.flagAnalyzing = false;
      }
    }
  }
  
  model: any;
  isUploadModalActive: boolean = false;
  loadingProgress: number = 0;
  queryImage: string = null;
  selectImageActiveTab: number = 0;
  imfid: string = null
  flagAnalyzing: boolean = false;
  dataURL:string=null;
  sendLambda(dataurl: string):any{
    const param  = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({'img_b64': dataurl})
    };
    setTimeout(() => {
      fetch("https://lab.ndl.go.jp/dl/api/imagefeatures", param)
      .then((response)=>response.json()).then((features)=>{
        console.log(features);
        putImageFeature(features["body"])
              .then(result => {
                this.illustresarray = result.data.list;
                this.flagAnalyzing = false;
              })
              .catch(() => {
                this.flagAnalyzing = false;
              });
      });
    },100);
  }
  
  
  createResizedCanvasElement (originalImg:any) {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      //canvas.width = MODEL_IMAGE_SIZE;
      //canvas.height = MODEL_IMAGE_SIZE;
      if(this.croprect){
        ctx.drawImage(originalImg,this.croprect.x,this.croprect.y,this.croprect.width,this.croprect.height,
                       0,0,MODEL_IMAGE_SIZE,MODEL_IMAGE_SIZE);
      }else{
        ctx.drawImage(originalImg,0,0,originalImg.width,originalImg.height,
                       0,0,MODEL_IMAGE_SIZE,MODEL_IMAGE_SIZE);
      }
      let dataurl=canvas.toDataURL("image/jpeg")
      return dataurl;
  }
  analyze(rect:{x,y,width,height}) {
    this.croprect=rect;
    //this.isUploadModalActive = false;
    this.flagAnalyzing = true;
    this.illustresarray=[];
    this.$nextTick(() => {
      setTimeout(() => {
        var img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = this.queryImage;
        img.onload = async () => {
          let dataurl=  this.createResizedCanvasElement(img);
          this.sendLambda(dataurl);
        };
      }, 100);
    });
  }
  removeFeature() {
    this.imfid = null;
    this.queryImage = null;
    this.flagAnalyzing=false;
  }
  /*sendTxt2VecAPI(keyword: string):any{
    this.flagAnalyzing =true;
    const param  = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({'keyword': keyword})
    };
    setTimeout(() => {
      fetch("/cliptext2vec/", param)
      .then((response)=>response.json()).then((features)=>{
        putTextFeature(features["body"])
              .then(result => {
                this.illustresarray = result.data.list;
                this.flagAnalyzing = false;
              })
              .catch(() => {
                this.flagAnalyzing = false;
              });
      });
    },100);
  }
  async freekeywordSearch(){
    setTimeout(() => {
      this.sendTxt2VecAPI(this.keyword2vec)
    });
    this.$router.push({
      name: "illustsearchres",
      query: { keyword2vec: this.keyword2vec }
    });
  }*/
  freekeywordSearch(){
    this.loadingResultsFlag=true;
    this.$router.push({
      name: "illustsearchres",
      query: { keyword2vec: this.keyword2vec }
    });
    this.$router.go(0);//強制リロード
  }
  selectFile(f: File) {
    let reader = new FileReader();
    reader.onload = (e: any) => {
      this.queryImage = e.target.result;
    };
    reader.readAsDataURL(f);
  }
  
  async created() {
    if(this.targeturl!==null&&this.targeturl!==""){
      this.$nextTick(() => {
        this.urlSearch();
      });
    }
  }
  ///////////////////////切り抜いて検索
  isRectModalActive: boolean = false;
  crop() {
    //this.$refs.recteditor=new RectEditor();
    this.isRectModalActive = true;
    this.$nextTick(() => {
      (<RectEditor>this.$refs.recteditor).setImage(<HTMLImageElement>this.$refs.queryrawimg);
    });
  }
  cropSearch(rect:{x,y,width,height}){
    //Do somehitng with rect
    if(rect){
      this.analyze(rect);
    }
    this.isRectModalActive = false;
  }
  
  metaInfo() {
    return {
      title: generateTitle({
        subTitle: this.$l2("画像検索", "Illustration search")
      })
    }
  }
  
}
