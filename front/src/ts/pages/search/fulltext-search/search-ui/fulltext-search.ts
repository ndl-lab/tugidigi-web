import { SearchResult } from "service/search-utils";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import FulltextResults from "pages/search/fulltext-search/results-ui/fulltext-results";
import "./fulltext-search.scss";

@Component({
  template: require("./fulltext-search.html"),
  components: {
    FulltextResults
  }
})
export default class FulltextSearch extends Vue {
  keyword: string="";
  fulltextflag: boolean=false;
  withouthighlightflag: boolean=false;
  filteropen:boolean=false;
  
  isFilter:boolean=false;
  title:string="";
  author:string="";
  since:string="";
  until:string="";
  
  beforeMount() {
    var query = Object.assign({}, this.$route.query);
    if (Array.isArray(query["keyword"])){
      this.keyword=query["keyword"].join(" ");
    }else{
      this.keyword=query["keyword"];
    }
    if(<string>query["searchfield"]=="contentonly")this.fulltextflag=true;
    else this.fulltextflag=false;
    if(<string>query["withouthighlight"]=="true")this.withouthighlightflag=true;
    else this.withouthighlightflag=false;
    if(query["f-title"]){
      this.filteropen=true;
      this.title=<string>query["f-title"];
    }
    if(query["f-responsibility"]){
      this.filteropen=true;
      this.author=<string>query["f-responsibility"];
    }
    if(query["r-publishyear"]){
      this.filteropen=true;
      this.since=(<string>query["r-publishyear"]).split(",")[0];
      this.until=(<string>query["r-publishyear"]).split(",")[1];
    }
  }
  keywordSearch() {
    if(this.keyword){
      this.filteropen=false;
      var pushobj:any={query: { keyword: this.keyword.split(/[\s　]+/),searchfield:"",withouthighlight:""}};
      if(this.fulltextflag){
        pushobj["query"]["searchfield"]="contentonly";
      }
      if(this.withouthighlightflag){
          pushobj["query"]["withouthighlight"]="true";
      }
      this.$router.push(pushobj);
      this.$router.go(0);//強制リロード
    }
  }
   filterSearch() {
    if(this.keyword){
      if(this.since==""&&this.until==""){
        var pushobj:any={'query': { 'keyword': this.keyword.split(/[\s　]+/),'searchfield':"",'withouthighlight':"",'f-title':this.title,'f-responsibility':this.author}};
        if(this.fulltextflag){//searchfield
          pushobj["query"]["searchfield"]="contentonly";
        }
        if(this.withouthighlightflag){
          pushobj["query"]["withouthighlight"]="true";
        }
        this.$router.push(pushobj);
        this.$router.go(0);//強制リロード
      }else if((!Number.isNaN(parseInt(this.since))&&!Number.isNaN(parseInt(this.until)))){
        this.filteropen=true;
        var pushobj:any={
            'query': { 'keyword': this.keyword.split(/[\s　]+/),
            'searchfield':"",'withouthighlight':"",'f-title':this.title,'f-responsibility':this.author,
            'r-publishyear':this.since+","+this.until}
          };
        if(this.fulltextflag){//searchfield
          pushobj["query"]["searchfield"]="contentonly";
        }
        if(this.withouthighlightflag){
          pushobj["query"]["withouthighlight"]="true";
        }
        this.$router.push(pushobj);
        this.$router.go(0);//強制リロード
      }
    }
  }
}
