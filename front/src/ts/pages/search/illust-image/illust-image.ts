import { Illustration } from "domain/illustration";
import { iiifUrlWithHeight } from "service/illust-utils";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import "./illust-image.scss";

@Component({
  template: require("./illust-image.html"),
  components: {}
})
export default class IllustImage extends Vue {
  @Prop()
  i: Illustration;

  @Prop({ default: 128 })
  width: number;

  @Prop({ default: true })
  cont: boolean;

  imgurl(i: Illustration) {
    return iiifUrlWithHeight(i, this.width);
  }

  search() {
    this.$emit("search", this.i);
  }

  click() {
    this.$emit("click", this.i);
  }
}
