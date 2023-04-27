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
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import IllustImage from "../../illust-image/illust-image";
import SketchCanvas from "../../sketch-canvas/sketch-canvas";
import BookEntry from "../../book_entry";
import "./illust-search.scss";
const IMF_FEATURE_CACHE: LsCacheConfig = { type: "imgf", maxCacheSize: 10 };
const MODEL_IMAGE_SIZE = 224;
//declare var tf: any;
import * as tf from '@tensorflow/tfjs';

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
  

  @Watch("activeTab")
  async watchForTab() {
    if(this.activeTab==0){
      this.illusts = (await getDefaultIllustrations()).data;
    }else if(this.activeTab==1){
      this.illusts = null;
    }
    this.$emit("change-tab",this.activeTab);
  }
  
  changeTab(num:number){
    this.activeTab=num;
  }

  illusts: Illustration[] = [];
  illustresarray: Illustration[] = [];

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
  //メタ検索関係
  /*keywordSearch(keywords: string[]) {
    //this.ssBook.image = [];
    if(keywords){
      this.ssBook.keywords = keywords;
    }else{
      this.ssBook.keywords = [this.keyword];
    }
    this.ssBook.execute();
  }*/
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
  searchByFeature(img: any){
    
    this.flagAnalyzing = true;
    /*this.$nextTick(() => {
      setTimeout(() => {
          tf.tidy(() => {
            try {
              // let tensor: tf.Tensor = tf.browser
              let tensor: any = tf.browser.fromPixels(img, 3);
              console.log( Array.from(tensor.dataSync()));
              tensor = tf.image.resizeBilinear(tensor, [
                MODEL_IMAGE_SIZE,
                MODEL_IMAGE_SIZE
              ]);
              tensor = tensor.reshape([
                1,
                MODEL_IMAGE_SIZE,
                MODEL_IMAGE_SIZE,
                3
              ]);
              tensor = tf.sub(tf.scalar(255.0),tf.cast(tensor, "float32")).div(tf.scalar(255.0));
              let output: any = this.model.predict(tensor);
              let vecsize: any=output.square().sum().sqrt();
              let feature: number[] = Array.from(output.div(vecsize).dataSync());
              //特徴量登録
              putImageFeature(feature)
                .then(result => {
                  this.illustresarray = result.data.list;
                  this.flagAnalyzing = false;
                })
                .catch(() => {
                  this.flagAnalyzing = false;
                });
            } catch (e) {
              this.flagAnalyzing = false;
            }
          });
        });
    });*/
  }
  selectFile(f: File) {
    let reader = new FileReader();
    reader.onload = (e: any) => {
      this.queryImage = e.target.result;
    };
    reader.readAsDataURL(f);
  }
  sketchmode:string= '';
  async mounted() {
    this.sketchmode = 'brush';
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
  
}
