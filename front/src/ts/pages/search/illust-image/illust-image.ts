import { Illustration } from "domain/illustration";
import { iiifUrlWithHeight,iiifUrl } from "service/illust-utils";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import "./illust-image.scss";

@Component({
  template: require("./illust-image.html"),
  components: {}
})
export default class IllustImage extends Vue {
  @Prop({ default: null })
  i: Illustration;

  @Prop({ default: 128 })
  width: number;

  @Prop({ default: true })
  cont: boolean;
  
  @Prop({ default: true })
  hastitle: boolean;
  
  imgurl(i: Illustration) {
    if(i)return iiifUrlWithHeight(i, this.width);
  }
  fullimgurl(i: Illustration) {
    if(i)return iiifUrl(i);
  }
  get sortofConfidence(){
    var keys=this.i.graphictags.slice().sort((a, b) => {
         return (a.confidence < b.confidence) ? 1 : (a.confidence > b.confidence) ? -1 : 0; }).slice(0,3);
    return keys;
  }
  
  search() {
    //this.$emit("search", this.i);
    this.$router.push({
      name: "illustsearchres",
      query: { image: [this.i.id]}
      //          'fc-graphictags.tagname':this.i.graphictags.map(function( value ) {return value.tagname}) }
    });
    this.$router.go(0);
  }
  searchwithtag(tagname:string) {
    //this.$emit("search", this.i);
    this.$router.push({
      name: "illustsearchres",
      query: { image: [this.i.id],"f-graphictags.tagname":[tagname] }
    });
    this.$router.go(0);
  }

  click() {
    this.$emit("click", this.i);
  }
}
